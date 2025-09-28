interface TagProps {
  children: React.ReactNode;
  color: string; // Tailwind color, e.g., 'blue', 'pink', 'orange'
}

export default function Tag({ children, color }: TagProps) {
  // Map common colors to Tailwind classes for consistency
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800',
    pink: 'bg-pink-100 text-pink-800',
    orange: 'bg-orange-100 text-orange-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  
  // Simple hashing function to assign a consistent color based on content
  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  // Determine a consistent color based on the children string
  const content = children ? String(children).toLowerCase() : 'default';
  const colorKeys = Object.keys(colorMap);
  const tagColorClass = colorMap[color] || colorMap[colorKeys[hashString(content) % colorKeys.length]];

  return (
    <span 
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${tagColorClass} mr-1 mb-1`}
    >
      {children}
    </span>
  );
}