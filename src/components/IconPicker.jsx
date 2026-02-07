import { useState, useMemo } from 'react';
import useEditorStore from '../store/editorStore';
import * as LucideIcons from 'lucide-react';

// Icon categories with lucide icon names
const ICON_CATEGORIES = {
  'Phổ biến': [
    'Star', 'Heart', 'Check', 'X', 'Plus', 'Minus', 'Search', 'Settings',
    'Home', 'User', 'Mail', 'Phone', 'Calendar', 'Clock', 'Bell', 'Bookmark'
  ],
  'Mũi tên': [
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUpRight', 'ArrowDownLeft',
    'ChevronUp', 'ChevronDown', 'ChevronLeft', 'ChevronRight',
    'ChevronsUp', 'ChevronsDown', 'ChevronsLeft', 'ChevronsRight',
    'MoveUp', 'MoveDown', 'MoveLeft', 'MoveRight', 'CornerUpRight', 'CornerDownLeft'
  ],
  'Giao tiếp': [
    'MessageCircle', 'MessageSquare', 'Send', 'Inbox', 'AtSign', 'Hash',
    'Phone', 'PhoneCall', 'PhoneOff', 'Video', 'VideoOff', 'Mic', 'MicOff',
    'Volume', 'Volume1', 'Volume2', 'VolumeX', 'Bell', 'BellOff', 'BellRing'
  ],
  'Thương mại': [
    'ShoppingCart', 'ShoppingBag', 'CreditCard', 'DollarSign', 'Wallet',
    'Receipt', 'Gift', 'Package', 'Truck', 'Store', 'Tag', 'Tags',
    'Percent', 'BadgePercent', 'Banknote', 'Coins', 'PiggyBank', 'TrendingUp', 'TrendingDown', 'BarChart3'
  ],
  'Công nghệ': [
    'Laptop', 'Monitor', 'Smartphone', 'Tablet', 'Tv', 'Speaker',
    'Cpu', 'HardDrive', 'Database', 'Server', 'Cloud', 'CloudOff',
    'Wifi', 'WifiOff', 'Bluetooth', 'Battery', 'BatteryCharging', 'Plug', 'Zap', 'ZapOff'
  ],
  'Tệp & Thư mục': [
    'File', 'FileText', 'FileImage', 'FileVideo', 'FileAudio', 'FileCode',
    'Folder', 'FolderOpen', 'FolderPlus', 'FolderMinus', 'FolderCheck',
    'Download', 'Upload', 'Share', 'Share2', 'Link', 'Link2', 'ExternalLink', 'Copy', 'Clipboard'
  ],
  'Trạng thái': [
    'Check', 'CheckCircle', 'CheckCircle2', 'CheckSquare',
    'X', 'XCircle', 'XSquare',
    'AlertCircle', 'AlertTriangle', 'AlertOctagon', 'Info', 'HelpCircle',
    'ThumbsUp', 'ThumbsDown', 'Flag', 'Award', 'Trophy', 'Medal', 'Crown', 'Sparkles'
  ],
  'Chỉnh sửa': [
    'Edit', 'Edit2', 'Edit3', 'Pencil', 'PenTool', 'Eraser',
    'Scissors', 'Copy', 'Clipboard', 'ClipboardCheck', 'ClipboardList',
    'Trash', 'Trash2', 'RotateCcw', 'RotateCw', 'Undo', 'Undo2', 'Redo', 'Redo2', 'RefreshCw'
  ],
  'Hình dạng': [
    'Circle', 'Square', 'Triangle', 'Hexagon', 'Octagon', 'Pentagon',
    'Diamond', 'RectangleHorizontal', 'RectangleVertical',
    'CircleDot', 'CircleDashed', 'SquareDashed', 'BoxSelect',
    'Layers', 'Layers2', 'Layers3', 'Layout', 'LayoutGrid', 'Grid', 'Grid3x3'
  ],
  'Bảo mật': [
    'Lock', 'LockOpen', 'Unlock', 'Key', 'KeyRound',
    'Shield', 'ShieldCheck', 'ShieldAlert', 'ShieldOff', 'ShieldQuestion',
    'Eye', 'EyeOff', 'Fingerprint', 'Scan', 'ScanFace', 'UserCheck', 'UserX', 'Users', 'UserPlus', 'UserMinus'
  ],
  'Phương tiện': [
    'Play', 'Pause', 'PlayCircle', 'PauseCircle', 'StopCircle',
    'SkipBack', 'SkipForward', 'Rewind', 'FastForward',
    'Volume', 'Volume1', 'Volume2', 'VolumeX',
    'Music', 'Music2', 'Mic', 'Radio', 'Headphones', 'Camera', 'Image'
  ],
  'Thời tiết': [
    'Sun', 'Moon', 'Cloud', 'CloudRain', 'CloudSnow', 'CloudLightning',
    'CloudSun', 'CloudMoon', 'Cloudy', 'Wind', 'Droplets', 'Snowflake',
    'Thermometer', 'ThermometerSun', 'ThermometerSnowflake', 'Umbrella', 'Rainbow', 'Sunrise', 'Sunset', 'Eclipse'
  ],
  'Điều hướng': [
    'Home', 'Building', 'Building2', 'Map', 'MapPin', 'MapPinned',
    'Navigation', 'Navigation2', 'Compass', 'Globe', 'Globe2',
    'Plane', 'Car', 'Bus', 'Train', 'Ship', 'Bike', 'Rocket', 'Anchor', 'Mountain'
  ],
  'Xã hội': [
    'Heart', 'HeartHandshake', 'HeartPulse', 'HeartCrack',
    'MessageCircle', 'MessageSquare', 'MessagesSquare',
    'Share', 'Share2', 'Forward', 'Reply', 'ReplyAll',
    'Smile', 'Frown', 'Meh', 'Angry', 'Laugh', 'PartyPopper', 'Sparkle', 'Flame'
  ],
  'Công cụ': [
    'Wrench', 'Hammer', 'Screwdriver', 'Axe', 'Shovel',
    'Paintbrush', 'Paintbrush2', 'Palette', 'Pipette', 'Ruler',
    'Calculator', 'Scale', 'Timer', 'Hourglass', 'Gauge', 'Magnet', 'Flashlight', 'Lightbulb', 'Cog', 'Settings2'
  ]
};

export default function IconPicker() {
  const addIcon = useEditorStore((s) => s.addIcon);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Phổ biến');

  // Get icons based on search or category
  const displayedIcons = useMemo(() => {
    if (searchQuery.trim()) {
      // Search across all icons
      const query = searchQuery.toLowerCase();
      const allIconNames = Object.keys(LucideIcons).filter(
        name => typeof LucideIcons[name] === 'function' && name !== 'createLucideIcon' && !name.includes('Icon')
      );
      return allIconNames
        .filter(name => name.toLowerCase().includes(query))
        .slice(0, 60);
    }

    return ICON_CATEGORIES[activeCategory] || [];
  }, [searchQuery, activeCategory]);

  const handleAddIcon = (iconName) => {
    // Store icon name as lucideIcon - will be rendered directly in Canvas
    addIcon({
      id: iconName.toLowerCase(),
      name: iconName,
      lucideIcon: iconName, // Store the Lucide icon name
      svg: null // Not using SVG string anymore
    });
  };

  return (
    <div className="icon-picker">
      {/* Search */}
      <div className="icon-picker__search">
        <LucideIcons.Search size={16} className="icon-picker__search-icon" />
        <input
          type="text"
          className="form-input"
          placeholder="Tìm icon..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      {!searchQuery && (
        <div className="icon-picker__categories">
          {Object.keys(ICON_CATEGORIES).map((cat) => (
            <button
              key={cat}
              className={`icon-picker__category ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Icons Grid */}
      <div className="icon-picker__grid">
        {displayedIcons.map((iconName) => {
          const IconComponent = LucideIcons[iconName];
          if (!IconComponent) return null;

          return (
            <button
              key={iconName}
              className="icon-picker__item"
              onClick={() => handleAddIcon(iconName)}
              title={iconName}
            >
              <IconComponent size={24} />
            </button>
          );
        })}
      </div>

      {displayedIcons.length === 0 && (
        <div className="icon-picker__empty">
          Không tìm thấy icon nào
        </div>
      )}
    </div>
  );
}
