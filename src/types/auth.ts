export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onLoginSuccess: (userName: string) => void;
}