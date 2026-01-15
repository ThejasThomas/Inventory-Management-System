import { injectable } from "tsyringe";
import bcrypt from "bcryptjs";

import { IBcrypt } from "./bcrypt_interface";
import { config } from "../../shared/config";

@injectable()
export class PasswordBcrypt implements IBcrypt {
	async hash(original: string) {
		return bcrypt.hash(original, config.bcryptSaltRounds);
	}
	async compare(current: string, original: string) {
		return bcrypt.compare(current, original);
	}
}
