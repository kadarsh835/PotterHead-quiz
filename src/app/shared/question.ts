import { Option } from './option';

export class Question{
  id: number;
  question: string;
  difficulty: number;
  category: string;
  option: Array<Option>
}
