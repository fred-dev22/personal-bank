import { Input } from "@jbaluch/components";
import "./vaults.css";

export const Vaults = () => {
  return (
    <div className="vaults-settings">
      <div className="settings-box">
        <div className="title-subtitle">
          <div className="title">Default settings</div>
          <p className="subtitle">Applies to newly added loans</p>
        </div>
        <div className="settings-caption">
          <div className="input-molecule">
            <div className="labels-wrapper">
              <div className="labels">
                <div className="label-asterisk">
                  <div className="asterisk">
                    <div className="text-wrapper-2">*</div>
                  </div>
                  <div className="label-2">Minimum Income DSCR</div>
                </div>
              </div>
            </div>
            <div className="input">
              <Input
                className="text-input-instance"
                placeholder="1.25"
                value="1.25"
                type="text"
                onChange={() => {}}
              />
            </div>
          </div>
          <div className="input-molecule">
            <div className="labels-wrapper">
              <div className="labels">
                <div className="label-asterisk">
                  <div className="asterisk">
                    <div className="text-wrapper-2">*</div>
                  </div>
                  <div className="label-2">Minimum Growth DSCR</div>
                </div>
              </div>
            </div>
            <div className="input">
              <Input
                className="text-input-instance"
                placeholder="1.25"
                value="1.25"
                type="text"
                onChange={() => {}}
              />
            </div>
          </div>
          <button className="save-btn" disabled>Save</button>
        </div>
      </div>
      <div className="settings-box">
        <div className="title-subtitle">
          <div className="title">Archived vaults</div>
          <p className="subtitle">You cannot lend from an archived vault.</p>
        </div>
        <div className="settings-caption">
        </div>
      </div>
    </div>
  );
}; 