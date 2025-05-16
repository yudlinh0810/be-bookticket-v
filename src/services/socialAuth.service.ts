// services/social-auth.service.ts
import { bookBusTicketsDB } from "../config/db";
import { generalAccessToken, generalRefreshToken } from "./auth.service";
import { CustomerService } from "./customer.service";

interface UserType {
  email: string;
  fullName: string;
  phone: string;
  dateBirth: string;
  urlImg: string;
  urlPublicImg: string;
  password?: string;
  role?: string;
}

export class SocialAuthService {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService(bookBusTicketsDB);
  }

  async handleSocialLogin(profile: any, provider: string) {
    const customer = await this.customerService.save(profile, provider);

    const detailCustomer: UserType = {
      email: customer.email,
      fullName: customer.fullName,
      phone: customer.phone,
      dateBirth: customer.dateBirth,
      urlImg: customer.urlImg,
      urlPublicImg: customer.urlPublicImg,
    };

    const access_token = generalAccessToken({
      id: customer.email,
      role: customer.role,
    });

    const refresh_token = generalRefreshToken({
      id: customer.email,
      role: customer.role,
    });

    const expirationTime = Date.now() + 60 * 60 * 1000;

    return {
      status: "OK",
      data: detailCustomer,
      access_token,
      refresh_token,
      expirationTime,
    };
  }
}
