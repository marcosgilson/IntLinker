export default function UserAvatar({ user, size = 'sm' }) {
    const dims = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

    const initials = (name) => {
        if (!name) return '?';
        return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    };

    if (user?.photo_url) {
        return (
            <img
                src={user.photo_url}
                alt={user.name}
                className={`${dims} rounded-full object-cover ring-2 ring-indigo-200 flex-shrink-0`}
            />
        );
    }

    return (
        <div className={`${dims} rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0`}>
            <span className="text-indigo-700 font-bold leading-none">{initials(user?.name)}</span>
        </div>
    );
}
