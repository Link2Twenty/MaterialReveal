import { useMemo } from 'react';

interface IconProps {
  /** Name of icon do be displayed */
  type: string;
}

export default function Icon({ type, ...props }: IconProps) {
  const icon = useMemo(() => {
    switch (type) {
      case 'delete':
        return (
          <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
          </svg>
        );
      case 'folder':
        return (
          <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
          </svg>
        );
      case 'download':
        return (
          <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z" />
          </svg>
        );
      case 'confirm':
        return (
          <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
          </svg>
        );
      default:
        console.warn(
          type ? `Icon: type ${type} is not valid; using fallback` : `Icon: no type present; using fallback`,
        );
        return (
          <svg {...props} height="24" viewBox="0 0 24 24" width="24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        );
    }
  }, [props, type]);

  return icon;
}
