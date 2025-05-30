import { NavButton } from "@jbaluch/components";
//@ts-expect-error - External CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import "./settings-menu.css";


export const SettingsMenu = ({
  selected,
  onSelect,
  accountItems,
  bankItems,
}: {
  selected: string;
  onSelect: (key: string) => void;
  accountItems: { id: string; label: string }[];
  bankItems: { id: string; label: string }[];
}) => (
  <nav className="settings-menu" aria-label="Settings navigation">
    <div className="settings-group">
      <div className="settings-group-title">Account</div>
      {accountItems.map(item => (
        <NavButton
          key={item.id}
          label={item.label}
          selected={selected === item.id}
          onClick={() => onSelect(item.id)}
          className="settings-navbutton"
        />
      ))}
    </div>
    <div className="settings-group">
      <div className="settings-group-title">Bank</div>
      {bankItems.map(item => (
        <NavButton
          key={item.id}
          label={item.label}
          selected={selected === item.id}
          onClick={() => onSelect(item.id)}
          className="settings-navbutton"
        />
      ))}
    </div>
  </nav>
); 