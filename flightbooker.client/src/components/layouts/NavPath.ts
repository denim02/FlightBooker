export type NavPath = {
    label: string;
    path?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    showOnlyIcon?: boolean;
  };