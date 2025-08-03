import { User } from '../types';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar = ({ user, size = 'md', className = '' }: AvatarProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };
  
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="h-full w-full rounded-full object-cover ring-2 ring-white shadow-md"
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <div 
        className={`h-full w-full rounded-full bg-gradient-to-br from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-primary))] flex items-center justify-center text-white font-medium ring-2 ring-white shadow-md ${user.avatarUrl ? 'hidden' : ''}`}
      >
        {initials}
      </div>
    </div>
  );
};

export default Avatar;