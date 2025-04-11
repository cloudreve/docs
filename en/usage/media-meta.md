# Extract Media Metadata {#media-meta}

Cloudreve supports extracting metadata from videos, audio, and images, and saving it to the file's metadata for optimized display and file searching.

## Extraction Logic

If a new file meets any of the following requirements, Cloudreve will begin extracting metadata after the file upload is complete.

- The storage policy has enabled native media information extractor, which means that the file extension is included in the extensions set in `Storage Policy Settings` -> `Media Information Extraction`
- The storage policy has not enabled native media information extractor but has enabled proxy media information extractor by activating `Proxy media extraction` in `Storage Policy Settings` -> `Extract media metadata`

All extraction tasks are managed by a unified queue. You can set queue parameters in `Settings` -> `Queue` -> `Media Metadata Extraction`. During task execution, Cloudreve will try each extractor in pipeline mode:

| Extractor             | Description                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Storage Policy Native | Based on the media service capabilities of the storage provider, it can extract image EXIF or audio/video stream parameters. No subsequent extractors will be executed after using this extractor.                                                                                                                                                                                                  |
| EXIF                  | Built-in. Extracts EXIF information from images: width, height, GPS coordinates, photographer, copyright information, software, camera information, lens information, exposure parameters, shooting time, photo orientation, etc. When the source file is on a third-party storage, it will attempt to download only the necessary parts using Range requests, without downloading the entire file. |
| Music Metadata        | Built-in. Extracts audio format, type, artist, album, composer, genre, and other information. When the source file is on a third-party storage, it will attempt to download only the necessary parts using Range requests, without downloading the entire file.                                                                                                                                     |
| FFProbe               | Requires [third-party dependencies](./thumbnails#ffmpeg). Extracts audio/video stream parameters: duration, bitrate, frame rate, codec, audio streams, chapters, and other information. When the source file is on a third-party storage, it will attempt to download only the necessary parts using Range requests, without downloading the entire file.                                           |

You can enable each extractor in `Settings` -> `Media Processing` -> `Extract media metadata`.

### Extractor Proxy

You can enable the proxy media metadata extraction feature in `Settings` -> `Media Processing` -> `Extract media metadata` -> `Proxy media extraction`, allowing Cloudreve to process and extract media metadata.

## Usage

Different types of media metadata are used as follows:

##### EXIF

- Search
- Display in file details sidebar

##### Music Metadata

- Search
- Display in file details sidebar
- Display in music player

##### Audio/Video Stream Parameters

- Search
- Display in file details sidebar
- Chapter information can be displayed in the progress bar of the ArtPlayer
  ::: warning
  Only Cloudreve's FFProbe can extract chapter data; the storage policy native extractor cannot extract chapters.
  :::
