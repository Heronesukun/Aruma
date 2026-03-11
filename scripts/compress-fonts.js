import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Fontmin from "fontmin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getConfig() {
  const configPath = path.join(__dirname, "../src/site.config.ts");
  const configContent = fs.readFileSync(configPath, "utf-8");

  const langMatch = configContent.match(/lang:\s*["']([^"']+)["']/);
  const lang = langMatch ? langMatch[1] : "zh-CN";

  const fontStartMatch = configContent.match(/font:\s*\{/);
  if (!fontStartMatch) {
    console.log("No font config found, skipping font compression");
    return { lang, fonts: [] };
  }

  const fontStartIndex = fontStartMatch.index;
  let braceCount = 0;
  let i = fontStartIndex + fontStartMatch[0].length - 1;
  let fontEndIndex = -1;

  for (; i < configContent.length; i++) {
    if (configContent[i] === "{") {
      braceCount++;
    } else if (configContent[i] === "}") {
      braceCount--;
      if (braceCount === 0) {
        fontEndIndex = i;
        break;
      }
    }
  }

  if (fontEndIndex === -1) {
    console.log("No font config found, skipping font compression");
    return { lang, fonts: [] };
  }

  const fontConfigStr = configContent.substring(
    fontStartIndex,
    fontEndIndex + 1,
  );
  const fonts = [];

  const fontTypes = ["asciiFont", "cjkFont"];

  for (const fontType of fontTypes) {
    const regex = new RegExp(`${fontType}:\\s*\\{([\\s\\S]*?)\\}`, "m");
    const match = fontConfigStr.match(regex);

    if (match) {
      const fontConfig = match[1];

      const compressMatch = fontConfig.match(/enableCompress:\s*(true|false)/);
      const enableCompress = compressMatch
        ? compressMatch[1] === "true"
        : false;

      const localFontsMatch = fontConfig.match(/localFonts:\s*\[(.*?)\]/s);
      let localFonts = [];

      if (localFontsMatch?.[1].trim()) {
        const fontsStr = localFontsMatch[1];
        localFonts =
          fontsStr
            .match(/["']([^"']+)["']/g)
            ?.map((s) => s.replace(/["']/g, "")) || [];
      }

      if (enableCompress && localFonts.length > 0) {
        fonts.push({
          type: fontType,
          files: localFonts,
          enableCompress,
        });
      }
    }
  }

  return { lang, fonts };
}

function readFilesRecursively(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      readFilesRecursively(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function extractText(content, ext) {
  let text = content;
  let frontmatterText = "";

  if (ext === ".md" || ext === ".mdx") {
    const frontmatterMatch = content.match(/^---[\s\S]*?---/m);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[0];

      const unquotedMatches = frontmatter.match(/^\s*\w+:\s*([^'"\n]+)$/gm);
      if (unquotedMatches) {
        unquotedMatches.forEach((match) => {
          const value = match.replace(/^\s*\w+:\s*/, "").trim();
          if (!value.match(/^(true|false|\d{4}-\d{2}-\d{2}|\d+)$/)) {
            frontmatterText += `${value} `;
          }
        });
      }

      const quotedMatches = frontmatter.match(/:\s*['"]([^'"]+)['"]/g);
      if (quotedMatches) {
        quotedMatches.forEach((match) => {
          const value = match.replace(/:\s*['"]([^'"]+)['"]/, "$1");
          frontmatterText += `${value} `;
        });
      }

      const listMatches = frontmatter.match(/^\s*-\s*([^\n]+)$/gm);
      if (listMatches) {
        listMatches.forEach((match) => {
          const value = match.replace(/^\s*-\s*/, "").trim();
          frontmatterText += `${value} `;
        });
      }
    }

    text = text.replace(/^---[\s\S]*?---\s*/m, "");
    text = text.replace(/```[\s\S]*?```/g, "");
    text = text.replace(/`[^`]+`/g, "");
  }

  text = text.replace(/<[^>]*>/g, " ");
  text = text.replace(/[#*_~`[\]()]/g, " ");
  text = text.replace(/https?:\/\/[^\s]+/g, "");
  text = text.replace(/\s+/g, " ").trim();

  const finalText = `${frontmatterText} ${text}`.trim();

  return finalText;
}

function getAsciiCharset() {
  const chars = new Set();

  for (let i = 32; i <= 126; i++) {
    chars.add(String.fromCharCode(i));
  }

  const common = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
  for (const char of common) {
    chars.add(char);
  }

  for (let i = 0; i <= 9; i++) {
    chars.add(String(i));
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (const char of alphabet) {
    chars.add(char);
  }

  return Array.from(chars).sort().join("");
}

async function collectText() {
  const { lang } = await getConfig();

  const textSet = new Set();

  const dataDir = path.join(__dirname, "../src/data");
  const dataFiles = readFilesRecursively(dataDir);

  dataFiles.forEach((file) => {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const content = fs.readFileSync(file, "utf-8");

      const patterns = [
        /"([^"\\]|\\.|\\n|\\t)*"/g,
        /'([^'\\]|\\.|\\n|\\t)*'/g,
        /`([^`\\]|\\.|\\n|\\t)*`/g,
      ];

      patterns.forEach((pattern) => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach((match) => {
            let text = match;

            if (
              (text.startsWith('"') && text.endsWith('"')) ||
              (text.startsWith("'") && text.endsWith("'")) ||
              (text.startsWith("`") && text.endsWith("`"))
            ) {
              text = text.slice(1, -1);
            }

            text = text
              .replace(/\\n/g, "\n")
              .replace(/\\t/g, "\t")
              .replace(/\\"/g, '"')
              .replace(/\\'/g, "'");

            for (const char of text) {
              textSet.add(char);
            }
          });
        }
      });
    }
  });

  const configFile = path.join(__dirname, "../src/site.config.ts");
  if (fs.existsSync(configFile)) {
    const content = fs.readFileSync(configFile, "utf-8");

    const patterns = [
      /"([^"\\]|\\.|\\n|\\t)*"/g,
      /'([^'\\]|\\.|\\n|\\t)*'/g,
      /`([^`\\]|\\.|\\n|\\t)*`/g,
    ];

    patterns.forEach((pattern) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          let text = match;

          if (
            (text.startsWith('"') && text.endsWith('"')) ||
            (text.startsWith("'") && text.endsWith("'")) ||
            (text.startsWith("`") && text.endsWith("`"))
          ) {
            text = text.slice(1, -1);
          }

          text = text
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'");

          for (const char of text) {
            textSet.add(char);
          }
        });
      }
    });
  }

  function findI18nFile(langCode) {
    const i18nDir = path.join(__dirname, "../src/i18n/languages");
    if (!fs.existsSync(i18nDir)) return null;

    const normalizedLang = langCode.toLowerCase().replace(/-/g, "-");
    const files = fs.readdirSync(i18nDir);

    for (const file of files) {
      const fileLang = file.replace(".ts", "").toLowerCase();
      if (
        fileLang === normalizedLang ||
        fileLang === normalizedLang.replace("-", "_")
      ) {
        return path.join(i18nDir, file);
      }
    }
    return null;
  }

  const i18nFile = findI18nFile(lang);
  if (i18nFile) {
    const content = fs.readFileSync(i18nFile, "utf-8");

    const patterns = [
      /"([^"\\]|\\.|\\n|\\t)*"/g,
      /'([^'\\]|\\.|\\n|\\t)*'/g,
      /`([^`\\]|\\.|\\n|\\t)*`/g,
    ];

    patterns.forEach((pattern) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          let text = match;

          if (
            (text.startsWith('"') && text.endsWith('"')) ||
            (text.startsWith("'") && text.endsWith("'")) ||
            (text.startsWith("`") && text.endsWith("`"))
          ) {
            text = text.slice(1, -1);
          }

          text = text
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'");

          for (const char of text) {
            textSet.add(char);
          }
        });
      }
    });
  }

  let contentDir;
  if (process.env.ENABLE_CONTENT_SYNC === "true" && process.env.CONTENT_DIR) {
    contentDir = path.join(__dirname, "..", process.env.CONTENT_DIR);
    console.log(`Using external content directory: ${process.env.CONTENT_DIR}`);
  } else {
    contentDir = path.join(__dirname, "../src/content");
  }

  if (!fs.existsSync(contentDir)) {
    console.log(`Content directory does not exist: ${contentDir}`);
    console.log("  Skipping content text collection");
  } else {
    const contentFiles = readFilesRecursively(contentDir);

    contentFiles.forEach((file) => {
      const ext = path.extname(file);
      if ([".md", ".mdx", ".ts", ".js"].includes(ext)) {
        const content = fs.readFileSync(file, "utf-8");
        const text = extractText(content, ext);
        for (const char of text) {
          if (
            char.match(
              /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af\u3000-\u303f\uff00-\uffef]/,
            )
          ) {
            textSet.add(char);
          }
        }
      }
    });
  }

  const commonChars = "0123456789，。！？；：\"\"''（）【】《》、·—…「」『』";
  for (const char of commonChars) {
    textSet.add(char);
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (const char of alphabet) {
    textSet.add(char);
  }

  return Array.from(textSet).sort().join("");
}

async function compressFonts() {
  try {
    const { fonts } = await getConfig();

    if (fonts.length === 0) {
      console.log(
        "No fonts to compress (enableCompress=false or localFonts is empty)",
      );
      return;
    }

    console.log(`Found ${fonts.length} font configs to compress`);

    const distDir = path.join(__dirname, "../dist");
    if (!fs.existsSync(distDir)) {
      console.log(
        "dist directory does not exist, please run astro build first",
      );
      return;
    }

    const distFontDir = path.join(distDir, "fonts");
    if (!fs.existsSync(distFontDir)) {
      fs.mkdirSync(distFontDir, { recursive: true });
    }

    const cjkText = await collectText();
    const asciiText = getAsciiCharset();

    console.log("Starting font compression...");

    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    let processedCount = 0;

    const errors = [];

    for (const fontConfig of fonts) {
      const text = fontConfig.type === "asciiFont" ? asciiText : cjkText;

      for (const fontFile of fontConfig.files) {
        const fontSrc = path.join(__dirname, "../public/fonts", fontFile);
        const ext = path.extname(fontFile).toLowerCase();
        const baseName = path.basename(fontFile, ext);

        if (!fs.existsSync(fontSrc)) {
          const errorMsg = `Font file does not exist [${fontConfig.type}]: "${fontFile}"\n  Expected path: public/fonts/${fontFile}`;
          errors.push(errorMsg);
          console.log(`Error: ${errorMsg}`);
          continue;
        }

        const originalSize = fs.statSync(fontSrc).size;
        totalOriginalSize += originalSize;

        if (ext === ".woff2" || ext === ".woff") {
          console.log(`Skipping ${fontFile} (already web-optimized format)`);

          const destFile = path.join(distFontDir, fontFile);
          fs.copyFileSync(fontSrc, destFile);
          totalCompressedSize += originalSize;
        } else if (ext === ".ttf" || ext === ".otf") {
          console.log(`Compressing ${fontFile}...`);

          const fontmin = new Fontmin()
            .src(fontSrc)
            .use(
              Fontmin.glyph({
                text: text,
                hinting: false,
              }),
            )
            .use(
              Fontmin.ttf2woff2({
                deflate: true,
              }),
            )
            .dest(distFontDir);

          await new Promise((resolve, reject) => {
            fontmin.run((err, files) => {
              if (err) {
                reject(err);
              } else {
                resolve(files);
              }
            });
          });

          const compressedFile = path.join(distFontDir, `${baseName}.woff2`);

          if (fs.existsSync(compressedFile)) {
            const compressedSize = fs.statSync(compressedFile).size;
            totalCompressedSize += compressedSize;
            const reduction = (
              (1 - compressedSize / originalSize) *
              100
            ).toFixed(2);

            console.log(
              `  ${fontFile} -> ${baseName}.woff2 (${(compressedSize / 1024).toFixed(2)} KB, reduced ${reduction}%)`,
            );
            processedCount++;
          }
        } else {
          console.log(`Unsupported font format, skipping: ${fontFile}`);
        }
      }
    }

    if (errors.length > 0) {
      console.log(`\nFont compression encountered ${errors.length} errors!`);

      const fontDir = path.join(__dirname, "../public/fonts");
      if (fs.existsSync(fontDir)) {
        const actualFiles = fs
          .readdirSync(fontDir)
          .filter((f) =>
            [".ttf", ".otf", ".woff", ".woff2"].includes(
              path.extname(f).toLowerCase(),
            ),
          );

        if (actualFiles.length > 0) {
          console.log("Available font files:");
          actualFiles.forEach((f) => console.log(`  - ${f}`));
        } else {
          console.log("  (font directory is empty)");
        }
      }

      process.exit(1);
    }

    if (processedCount > 0) {
      const totalReduction = (
        (1 - totalCompressedSize / totalOriginalSize) *
        100
      ).toFixed(2);
      console.log(`\nFont optimization complete!`);
      console.log(
        `  Files processed: ${processedCount}, Overall reduction: ${totalReduction}%`,
      );
    } else {
      console.log("\nNo font files processed");
    }
  } catch (error) {
    console.error("Font compression failed:", error);
    process.exit(1);
  }
}

compressFonts();
