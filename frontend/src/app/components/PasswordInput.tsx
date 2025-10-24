import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
	label?: string;
	showPassword: boolean;
	setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordInput = ({
	label = "Password",
	showPassword,
	setShowPassword,
}: PasswordInputProps) => {
	return (
		<div className="grid gap-2">
			<Label htmlFor="password">{label}</Label>
			<InputGroup>
				<InputGroupInput
					placeholder={showPassword ? "Enter password" : "*********"}
					type={showPassword ? "text" : "password"}
				/>
				<InputGroupAddon align="inline-end">
					<Tooltip>
						<TooltipTrigger asChild>
							<InputGroupButton
								variant="ghost"
								aria-label="Info"
								size="icon-xs"
								onClick={() => setShowPassword((prev) => !prev)}
							>
								{showPassword ? <EyeOff /> : <Eye />}
							</InputGroupButton>
						</TooltipTrigger>
						<TooltipContent>
							<p>Show or hide password text</p>
						</TooltipContent>
					</Tooltip>
				</InputGroupAddon>
			</InputGroup>
		</div>
	);
};

export default PasswordInput;
