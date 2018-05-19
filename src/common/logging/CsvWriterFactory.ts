import { CsvWriter } from './CsvWriter';

export class CsvWriterFactory {
  public createCsvWriter(gameName: string) {
    return new CsvWriter(gameName);
  }
}
