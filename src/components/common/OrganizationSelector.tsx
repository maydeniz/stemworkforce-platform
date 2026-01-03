// ===========================================
// ORGANIZATION SELECTOR COMPONENT
// Typeahead with progressive disclosure for hierarchical org selection
// ===========================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  searchOrganizations,
  getSubunits,
  getNestedSubunits,
  getRoleOrganizationType,
  type Organization,
  type SubUnit,
} from '@/data/organizations';

interface OrganizationSelectorProps {
  role: string;
  value: {
    organizationId: string;
    organizationName: string;
    subunitId?: string;
    subunitName?: string;
    departmentId?: string;
    departmentName?: string;
    customOrganization?: string;
    customSubunit?: string;
    customDepartment?: string;
  };
  onChange: (value: OrganizationSelectorProps['value']) => void;
  disabled?: boolean;
}

export const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({
  role,
  value,
  onChange,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Organization[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [subunits, setSubunits] = useState<SubUnit[]>([]);
  const [departments, setDepartments] = useState<SubUnit[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const orgType = getRoleOrganizationType(role);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search organizations as user types
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = searchOrganizations(searchQuery, orgType || undefined);
      setSearchResults(results);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery, orgType]);

  // Load subunits when organization is selected
  useEffect(() => {
    if (value.organizationId) {
      const subs = getSubunits(value.organizationId);
      setSubunits(subs);
    } else {
      setSubunits([]);
      setDepartments([]);
    }
  }, [value.organizationId]);

  // Load departments when subunit is selected
  useEffect(() => {
    if (value.organizationId && value.subunitId) {
      const deps = getNestedSubunits(value.organizationId, value.subunitId);
      setDepartments(deps);
    } else {
      setDepartments([]);
    }
  }, [value.organizationId, value.subunitId]);

  const handleOrganizationSelect = useCallback((org: Organization) => {
    setSelectedOrg(org);
    setSearchQuery(org.name);
    setShowDropdown(false);
    onChange({
      organizationId: org.id,
      organizationName: org.name,
      subunitId: undefined,
      subunitName: undefined,
      departmentId: undefined,
      departmentName: undefined,
      customOrganization: undefined,
      customSubunit: undefined,
      customDepartment: undefined,
    });
  }, [onChange]);

  const handleSubunitSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const subunitId = e.target.value;
    const subunit = subunits.find(s => s.id === subunitId);
    onChange({
      ...value,
      subunitId: subunitId || undefined,
      subunitName: subunit?.name,
      departmentId: undefined,
      departmentName: undefined,
    });
  }, [onChange, value, subunits]);

  const handleDepartmentSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const departmentId = e.target.value;
    const department = departments.find(d => d.id === departmentId);
    onChange({
      ...value,
      departmentId: departmentId || undefined,
      departmentName: department?.name,
    });
  }, [onChange, value, departments]);

  const handleManualEntry = useCallback(() => {
    setShowManualEntry(true);
    setSelectedOrg(null);
    setSearchQuery('');
    onChange({
      organizationId: '',
      organizationName: '',
      subunitId: undefined,
      subunitName: undefined,
      departmentId: undefined,
      departmentName: undefined,
      customOrganization: '',
      customSubunit: '',
      customDepartment: '',
    });
  }, [onChange]);

  const handleBackToSearch = useCallback(() => {
    setShowManualEntry(false);
    onChange({
      organizationId: '',
      organizationName: '',
      subunitId: undefined,
      subunitName: undefined,
      departmentId: undefined,
      departmentName: undefined,
      customOrganization: undefined,
      customSubunit: undefined,
      customDepartment: undefined,
    });
  }, [onChange]);

  const handleCustomChange = useCallback((field: string, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }, [onChange, value]);

  const clearSelection = useCallback(() => {
    setSelectedOrg(null);
    setSearchQuery('');
    setSubunits([]);
    setDepartments([]);
    onChange({
      organizationId: '',
      organizationName: '',
      subunitId: undefined,
      subunitName: undefined,
      departmentId: undefined,
      departmentName: undefined,
      customOrganization: undefined,
      customSubunit: undefined,
      customDepartment: undefined,
    });
  }, [onChange]);

  // Get labels based on organization type
  const getLabels = () => {
    switch (orgType) {
      case 'education':
      case 'university':
      case 'community_college':
        return {
          org: 'Institution',
          subunit: 'College / School',
          department: 'Department',
          placeholder: 'Search for your university or college...',
          notFound: "Can't find your institution?",
        };
      case 'national_lab':
        return {
          org: 'Laboratory',
          subunit: 'Division',
          department: 'Group',
          placeholder: 'Search for your national laboratory...',
          notFound: "Can't find your laboratory?",
        };
      case 'federal_agency':
        return {
          org: 'Agency',
          subunit: 'Office / Bureau',
          department: 'Division',
          placeholder: 'Search for your federal agency...',
          notFound: "Can't find your agency?",
        };
      default:
        return {
          org: 'Organization',
          subunit: 'Department',
          department: 'Team',
          placeholder: 'Enter your organization name...',
          notFound: "Can't find your organization?",
        };
    }
  };

  const labels = getLabels();

  // If no orgType, show simple text input
  if (!orgType) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Organization Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={value.customOrganization || ''}
          onChange={(e) => handleCustomChange('customOrganization', e.target.value)}
          placeholder="Enter your organization name"
          disabled={disabled}
          className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>
    );
  }

  // Manual entry mode
  if (showManualEntry) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300">
            Manual Entry
          </label>
          <button
            type="button"
            onClick={handleBackToSearch}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to search
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">{labels.org} Name *</label>
            <input
              type="text"
              value={value.customOrganization || ''}
              onChange={(e) => handleCustomChange('customOrganization', e.target.value)}
              placeholder={`Enter ${labels.org.toLowerCase()} name`}
              disabled={disabled}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">{labels.subunit} (optional)</label>
            <input
              type="text"
              value={value.customSubunit || ''}
              onChange={(e) => handleCustomChange('customSubunit', e.target.value)}
              placeholder={`Enter ${labels.subunit.toLowerCase()} name`}
              disabled={disabled}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">{labels.department} (optional)</label>
            <input
              type="text"
              value={value.customDepartment || ''}
              onChange={(e) => handleCustomChange('customDepartment', e.target.value)}
              placeholder={`Enter ${labels.department.toLowerCase()} name`}
              disabled={disabled}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Organization Search */}
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {labels.org} <span className="text-red-400">*</span>
        </label>

        {value.organizationId ? (
          // Selected organization display
          <div className="flex items-center justify-between px-4 py-3 bg-dark-bg border border-dark-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-sm">
                  {selectedOrg?.shortName?.substring(0, 2) || value.organizationName.substring(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{value.organizationName}</p>
                {selectedOrg?.location && (
                  <p className="text-gray-500 text-sm">{selectedOrg.location}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={clearSelection}
              disabled={disabled}
              className="text-gray-400 hover:text-white p-1"
              title="Clear selection"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          // Search input
          <>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                placeholder={labels.placeholder}
                disabled={disabled}
                className="w-full px-4 py-3 pl-10 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-dark-surface border border-dark-border rounded-lg shadow-xl max-h-60 overflow-auto">
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map((org) => (
                      <button
                        key={org.id}
                        type="button"
                        onClick={() => handleOrganizationSelect(org)}
                        className="w-full px-4 py-3 text-left hover:bg-dark-bg transition-colors flex items-center gap-3 border-b border-dark-border last:border-0"
                      >
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-400 text-xs font-medium">
                            {org.shortName?.substring(0, 2) || org.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{org.name}</p>
                          <div className="flex items-center gap-2 text-sm">
                            {org.location && <span className="text-gray-500">{org.location}</span>}
                            {org.classification && (
                              <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                                {org.classification}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleManualEntry}
                      className="w-full px-4 py-3 text-left text-blue-400 hover:bg-dark-bg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      {labels.notFound} Enter manually
                    </button>
                  </>
                ) : searchQuery.length >= 2 ? (
                  <div className="p-4">
                    <p className="text-gray-400 text-center mb-2">No results found for "{searchQuery}"</p>
                    <button
                      type="button"
                      onClick={handleManualEntry}
                      className="w-full px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                    >
                      Enter organization manually
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </>
        )}

        {/* Manual entry link when not searching */}
        {!value.organizationId && !showDropdown && (
          <button
            type="button"
            onClick={handleManualEntry}
            className="mt-2 text-sm text-gray-500 hover:text-blue-400"
          >
            {labels.notFound} Enter manually →
          </button>
        )}
      </div>

      {/* College/School Selector - Progressive Disclosure */}
      {value.organizationId && subunits.length > 0 && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {labels.subunit} <span className="text-gray-500">(optional)</span>
          </label>
          <select
            value={value.subunitId || ''}
            onChange={handleSubunitSelect}
            disabled={disabled}
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">Select {labels.subunit.toLowerCase()}...</option>
            {subunits.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Department Selector - Second Level Progressive Disclosure */}
      {value.subunitId && departments.length > 0 && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {labels.department} <span className="text-gray-500">(optional)</span>
          </label>
          <select
            value={value.departmentId || ''}
            onChange={handleDepartmentSelect}
            disabled={disabled}
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">Select {labels.department.toLowerCase()}...</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default OrganizationSelector;
