export class Coupon {
  constructor(
    public readonly coupon_code: string,
    public readonly coupon_description: string,
    public readonly discount: number,
  ){}
}