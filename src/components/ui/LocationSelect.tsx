import { useMemo, type ReactNode } from "react";
import SearchableSelect, { type SelectOption } from "./SearchableSelect";
import { getLocationOptions } from "../../lib/locations";

export default function LocationSelect({
  value,
  onChange,
  includeRemote = true,
  placeholder = "Select location",
  icon,
}: {
  value: string;
  onChange: (v: string) => void;
  includeRemote?: boolean;
  placeholder?: string;
  icon?: ReactNode;
}) {
  const options: SelectOption[] = useMemo(
    () =>
      getLocationOptions(includeRemote).map((o) => ({
        value: o.value,
        label: o.vi && o.vi !== o.value ? `${o.value} · ${o.vi}` : o.value,
        short: o.value,
        group: o.group,
        keywords: `${o.vi} ${o.keywords ?? ""}`,
      })),
    [includeRemote]
  );

  return (
    <SearchableSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      searchPlaceholder="Search city or country (Hà Nội, Canada...)"
      allowCustom
      customLabel={(q) => `Use "${q}"`}
      icon={icon}
      emptyText="No match — type to add your own"
    />
  );
}
