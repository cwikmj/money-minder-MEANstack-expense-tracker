export interface Operation {
    type: 'income' | 'expense';
    category: string;
    amount: number;
    description: string;
    _id: string;
}