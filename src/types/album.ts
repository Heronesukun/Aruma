export interface Photo {
	id?: string;
	src: string;
	alt?: string;
	title?: string;
	thumbnail?: string;
	tags?: string[];
	description?: string;
	date?: string;
	location?: string;
	width?: number;
	height?: number;
	camera?: string;
	lens?: string;
	settings?: {
		aperture?: string;
		shutter?: string;
		iso?: string;
		focal?: string;
	};
}

export interface AlbumGroup {
	id: string;
	title: string;
	description?: string;
	cover: string;
	date: string;
	location?: string;
	tags?: string[];
	layout?: "grid" | "masonry";
	columns?: number;
	hidden?: boolean;
	mode?: "external" | "local";
	photos: Photo[];
}
