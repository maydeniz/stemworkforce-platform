import { useState, useMemo } from 'react';
import {
  ToggleLeft, ToggleRight, Search, ChevronDown, ChevronRight,
  AlertTriangle, CheckCircle2, XCircle,
  Clock, Beaker, RotateCcw, Info,
  Users, Building2, Handshake, Briefcase, GraduationCap, BookOpen,
  Eye, EyeOff, Calendar, Trophy
} from 'lucide-react';
import { useFeatures } from '@/contexts/FeatureContext';
import {
  NavigationFlags,
  NavMenu,
  NavSection,
  NavItem,
  FeatureStatus,
} from '@/config/featureFlags';

// ===========================================
// FEATURE FLAGS MANAGEMENT TAB
// Navigation-Mirrored Structure for Easy Management
// ===========================================

// Menu icons mapping
const MENU_ICONS: Record<keyof NavigationFlags, any> = {
  forTalent: Users,
  forEmployers: Building2,
  forPartners: Handshake,
  forProviders: Briefcase,
  forStudents: GraduationCap,
  forCollegeStudents: GraduationCap,
  challenges: Trophy,
  events: Calendar,
  resources: BookOpen,
};

// Menu colors mapping
const MENU_COLORS: Record<keyof NavigationFlags, string> = {
  forTalent: 'emerald',
  forEmployers: 'blue',
  forPartners: 'violet',
  forProviders: 'amber',
  forStudents: 'pink',
  forCollegeStudents: 'indigo',
  challenges: 'yellow',
  events: 'orange',
  resources: 'cyan',
};

// Status configuration for display
const STATUS_CONFIG: Record<FeatureStatus, { label: string; icon: any; color: string; bgColor: string }> = {
  enabled: { label: 'Enabled', icon: CheckCircle2, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  disabled: { label: 'Disabled', icon: XCircle, color: 'text-slate-400', bgColor: 'bg-slate-500/20' },
  beta: { label: 'Beta', icon: Beaker, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  'coming-soon': { label: 'Coming Soon', icon: Clock, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
};

const FeatureFlagsTab = () => {
  const {
    navigationFlags,
    updateItemStatus,
    enableAll,
    disableAll,
    enableMenu,
    disableMenu,
    enableSection,
    disableSection,
    resetToDefaults,
    getMenuStats,
  } = useFeatures();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    forTalent: true,
    forEmployers: false,
    forPartners: false,
    forProviders: false,
    forStudents: false,
    forCollegeStudents: false,
    events: false,
    resources: false,
  });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    let total = 0;
    let enabled = 0;
    let disabled = 0;

    (Object.keys(navigationFlags) as (keyof NavigationFlags)[]).forEach(menuKey => {
      const stats = getMenuStats(navigationFlags[menuKey]);
      total += stats.total;
      enabled += stats.enabled;
      disabled += stats.disabled;
    });

    return { total, enabled, disabled };
  }, [navigationFlags, getMenuStats]);

  // Toggle menu expansion
  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Reset all to defaults
  const handleReset = () => {
    resetToDefaults();
    setShowResetConfirm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Quick toggle for entire menu
  const toggleEntireMenu = (menuKey: keyof NavigationFlags, currentlyEnabled: boolean) => {
    if (currentlyEnabled) {
      disableMenu(menuKey);
    } else {
      enableMenu(menuKey);
    }
  };

  // Quick toggle for entire section
  const toggleEntireSection = (menuKey: keyof NavigationFlags, sectionId: string, currentlyEnabled: boolean) => {
    if (currentlyEnabled) {
      disableSection(menuKey, sectionId);
    } else {
      enableSection(menuKey, sectionId);
    }
  };

  // Filter items based on search
  const filterItems = (items: NavItem[]): NavItem[] => {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item =>
      item.label.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.path.toLowerCase().includes(term)
    );
  };

  // Check if section has matching items
  const sectionHasMatches = (section: NavSection): boolean => {
    if (!searchTerm) return true;
    return filterItems(section.items).length > 0;
  };

  // Check if menu has matching items
  const menuHasMatches = (menu: NavMenu): boolean => {
    if (!searchTerm) return true;
    return menu.sections.some(section => sectionHasMatches(section));
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <BookOpen size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overallStats.total}</p>
              <p className="text-sm text-slate-400">Total Pages/Features</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Eye size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overallStats.enabled}</p>
              <p className="text-sm text-slate-400">Visible</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-500/20">
              <EyeOff size={20} className="text-slate-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overallStats.disabled}</p>
              <p className="text-sm text-slate-400">Hidden</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/20">
              <Handshake size={20} className="text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">6</p>
              <p className="text-sm text-slate-400">Navigation Menus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-400" />
          <span className="text-emerald-400">Changes saved successfully! Refresh page to see navigation updates.</span>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search pages & features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 w-72"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={enableAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm transition-colors"
          >
            <Eye size={16} />
            Enable All
          </button>
          <button
            onClick={disableAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
          >
            <EyeOff size={16} />
            Disable All
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Navigation Menus */}
      <div className="space-y-4">
        {(Object.keys(navigationFlags) as (keyof NavigationFlags)[])
          .filter(menuKey => menuHasMatches(navigationFlags[menuKey]))
          .map((menuKey) => {
            const menu = navigationFlags[menuKey];
            const MenuIcon = MENU_ICONS[menuKey];
            const color = MENU_COLORS[menuKey];
            const isExpanded = expandedMenus[menuKey];
            const stats = getMenuStats(menu);
            const isMenuEnabled = menu.status === 'enabled';

            return (
              <div key={menuKey} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
                  <button
                    onClick={() => toggleMenu(menuKey)}
                    className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity"
                  >
                    <div className={`p-2 rounded-lg bg-${color}-500/20`}>
                      <MenuIcon size={20} className={`text-${color}-400`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{menu.title}</h3>
                      <p className="text-sm text-slate-400">{menu.description}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronDown size={20} className="text-slate-400 ml-2" />
                    ) : (
                      <ChevronRight size={20} className="text-slate-400 ml-2" />
                    )}
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                        {stats.enabled} visible
                      </span>
                      <span className="px-2 py-1 bg-slate-500/20 text-slate-400 rounded text-xs">
                        {stats.disabled} hidden
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEntireMenu(menuKey, isMenuEnabled);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        isMenuEnabled
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                      title={isMenuEnabled ? 'Disable entire menu' : 'Enable entire menu'}
                    >
                      {isMenuEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </div>
                </div>

                {/* Menu Sections */}
                {isExpanded && (
                  <div className="divide-y divide-slate-800/50">
                    {menu.sections
                      .filter(section => sectionHasMatches(section))
                      .map((section) => {
                        const sectionKey = `${menuKey}-${section.id}`;
                        const isSectionExpanded = expandedSections[sectionKey] ?? true;
                        const isSectionEnabled = section.status === 'enabled';
                        const filteredItems = filterItems(section.items);

                        return (
                          <div key={section.id} className="bg-slate-800/20">
                            {/* Section Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-800/30">
                              <button
                                onClick={() => toggleSection(sectionKey)}
                                className="flex items-center gap-2 flex-1 text-left hover:opacity-80 transition-opacity"
                              >
                                {isSectionExpanded ? (
                                  <ChevronDown size={16} className="text-slate-400" />
                                ) : (
                                  <ChevronRight size={16} className="text-slate-400" />
                                )}
                                <span className="font-medium text-sm">{section.title}</span>
                                <span className="text-xs text-slate-500">
                                  ({filteredItems.filter(i => i.status === 'enabled').length}/{filteredItems.length})
                                </span>
                              </button>
                              <button
                                onClick={() => toggleEntireSection(menuKey, section.id, isSectionEnabled)}
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                  isSectionEnabled
                                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                                }`}
                              >
                                {isSectionEnabled ? 'Disable Section' : 'Enable Section'}
                              </button>
                            </div>

                            {/* Section Items */}
                            {isSectionExpanded && (
                              <div className="divide-y divide-slate-800/30">
                                {filteredItems.map((item) => {
                                  const isItemEnabled = item.status === 'enabled';
                                  const statusConfig = STATUS_CONFIG[item.status];

                                  return (
                                    <div
                                      key={item.id}
                                      className={`flex items-center justify-between px-4 py-3 pl-10 hover:bg-slate-800/30 transition-colors ${
                                        !isItemEnabled ? 'opacity-60' : ''
                                      }`}
                                    >
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{item.label}</span>
                                            {item.status !== 'enabled' && (
                                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                                                {statusConfig.label}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-xs text-slate-500 truncate">{item.description}</p>
                                          <code className="text-[10px] text-slate-600 font-mono">{item.path}</code>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 ml-4">
                                        <select
                                          value={item.status}
                                          onChange={(e) => updateItemStatus(menuKey, section.id, item.id, e.target.value as FeatureStatus)}
                                          className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${statusConfig.bgColor} ${statusConfig.color}`}
                                        >
                                          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                            <option key={key} value={key} className="bg-slate-800 text-white">
                                              {config.label}
                                            </option>
                                          ))}
                                        </select>
                                        <button
                                          onClick={() => updateItemStatus(
                                            menuKey,
                                            section.id,
                                            item.id,
                                            isItemEnabled ? 'disabled' : 'enabled'
                                          )}
                                          className={`p-1.5 rounded transition-colors ${
                                            isItemEnabled
                                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                              : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                          }`}
                                          title={isItemEnabled ? 'Hide this page' : 'Show this page'}
                                        >
                                          {isItemEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* No Results */}
      {searchTerm && !Object.keys(navigationFlags).some(k => menuHasMatches(navigationFlags[k as keyof NavigationFlags])) && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <Search size={48} className="mx-auto text-slate-600 mb-4" />
          <h4 className="text-lg font-medium mb-2">No pages found</h4>
          <p className="text-slate-400 text-sm">
            Try adjusting your search term.
          </p>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Info size={18} className="text-blue-400" />
          How Feature Flags Work
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h5 className="font-medium text-emerald-400 mb-2">Visibility Levels</h5>
            <ul className="space-y-1 text-slate-400">
              <li><strong>Menu Toggle:</strong> Shows/hides entire navigation menu</li>
              <li><strong>Section Toggle:</strong> Shows/hides all items in a section</li>
              <li><strong>Item Toggle:</strong> Shows/hides individual page links</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h5 className="font-medium text-amber-400 mb-2">Status Options</h5>
            <ul className="space-y-1 text-slate-400">
              <li><strong>Enabled:</strong> Page is visible in navigation</li>
              <li><strong>Disabled:</strong> Page is hidden from navigation</li>
              <li><strong>Beta:</strong> Coming soon with beta badge</li>
              <li><strong>Coming Soon:</strong> Shown with coming soon badge</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Note: Changes take effect after page refresh. Navigation will update to reflect your selections.
        </p>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-red-500/20">
                  <AlertTriangle size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Reset All Feature Flags?</h3>
                  <p className="text-sm text-slate-400">This will enable all pages and features.</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6">
                All navigation items will be reset to their default (enabled) state.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 rounded-lg font-medium transition-colors"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureFlagsTab;
