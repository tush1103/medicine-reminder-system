export class CreateOrderDto {
  userId: string;
  userEmail: string;
  userPhone: string;
  medicineName: string;
  dosageFrequency: number; // times per day: 1, 2, 3 or 4
  supplyDays: number;      // how many days this medicine supply lasts
}
