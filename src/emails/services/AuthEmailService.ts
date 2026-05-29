import { emailConfig } from "../config/config";
import { renderVerificationEmail } from "../templates/VerificationEmail";
import { VerificationEmailData } from "../types/email.types";
import { EmailService } from "./EmailService";

export class AuthEmailService {
    static async sendVerificationEmail(data : VerificationEmailData) : Promise<void> {
        await EmailService.send({
            from: emailConfig.from.verification,
            to: data.email,
            subject: 'Confirma tu cuenta',
            text: renderVerificationEmail(data),
            html: renderVerificationEmail(data),
        })
    }
}
