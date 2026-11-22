declare module "lucide-react" {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;

  export const Activity: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Calendar: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const Clock: LucideIcon;
  export const Copy: LucideIcon;
  export const Download: LucideIcon;
  export const Edit: LucideIcon;
  export const Edit3: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const KeyRound: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Lock: LucideIcon;
  export const LogOut: LucideIcon;
  export const Mail: LucideIcon;
  export const MapPin: LucideIcon;
  export const Menu: LucideIcon;
  export const Moon: LucideIcon;
  export const Phone: LucideIcon;
  export const Plus: LucideIcon;
  export const QrCode: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Save: LucideIcon;
  export const Search: LucideIcon;
  export const Send: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Star: LucideIcon;
  export const Stethoscope: LucideIcon;
  export const Sun: LucideIcon;
  export const UploadCloud: LucideIcon;
  export const User: LucideIcon;
  export const Video: LucideIcon;
  export const X: LucideIcon;
}
