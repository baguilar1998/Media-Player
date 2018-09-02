export class Song {
  title: string;
  artist: string;
  filePath: string;

  constructor(t: string, a: string, fp: string) {
    this.title = t;
    this.artist = a;
    this.filePath = fp;
  }

}
