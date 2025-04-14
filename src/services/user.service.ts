import bcrypt from "bcrypt";
import { generalAccessToken, generalRefreshToken } from "../utils/jwt.util";
import { convertTimestamp } from "../utils/convertTimeStamp";

interface TokenData {
  id: string;
  role: string;
}

interface LoginType {
  email: string;
  password: string;
}

export class UserService {
  private db;
  constructor(db: any) {
    this.db = db;
  }
  decodeToken(token: string): TokenData | null {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { id: payload.id, role: payload.role };
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

  isAdmin(token: string): boolean {
    const decoded = this.decodeToken(token);
    return decoded ? decoded.role === "admin" : false;
  }

  async checkUser(email: string): Promise<boolean> {
    const [rows] = await this.db.execute(
      "select count(email) as countUser from usr where email = ?",
      [email]
    );
    const countUser = (rows as any)[0].countUser;
    return countUser > 0 ? true : false;
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      const [rows] = await this.db.execute(
        "select email, password, role from user where email = ?",
        [email]
      );
      return rows[0];
    } catch (err) {
      console.error("Query error:", err);
    }
  }

  login(userLogin: LoginType): Promise<
    | {
        access_token: string;
        status: string;
        expirationTime: number;
        refresh_token: string;
      }
    | {
        status: string;
        message: string;
      }
  > {
    return new Promise(async (resolve, reject) => {
      try {
        const checkPerson = await this.getUserByEmail(userLogin.email);
        if (checkPerson === null) {
          resolve({
            status: "ERR",
            message: "The user is not defined",
          });
        } else {
          const comparePass = await bcrypt.compareSync(userLogin.password, checkPerson.password);
          if (!comparePass) {
            resolve({
              status: "ERR",
              message: "Password error",
            });
          } else {
            const access_token = generalAccessToken({
              id: checkPerson?.email,
              role: checkPerson?.role,
            });

            const expirationTime = Date.now() + 60 * 60 * 1000;

            const refresh_token = generalRefreshToken({
              id: checkPerson?.email,
              role: checkPerson?.role,
            });

            resolve({
              status: "OK",
              access_token,
              refresh_token,
              expirationTime,
            });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  delete(id: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.execute("call delete_user(?)", [id]);
        resolve({
          status: "OK",
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
