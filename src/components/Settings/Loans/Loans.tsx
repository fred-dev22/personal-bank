import { useState } from "react";
import { Input } from "@jbaluch/components";
import "./loans.css";

export const Loans = () => {
  const [lateFees, setLateFees] = useState(false);
  const [loanSummaries, setLoanSummaries] = useState(false);

  return (
    <div className="settings">
      <div className="settings-box">
        <div className="title-subtitle">
          <div className="title">Default settings</div>
          <p className="subtitle">Applies to newly added loans</p>
        </div>
        <div className="settings-caption">
          <div className="loan-default">
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
            <div className="loan-block loan-block-disabled">
              <div className="loan-switch-row">
                <span className="loan-switch-label">Late fees</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={lateFees}
                    onChange={() => setLateFees(v => !v)}
                    disabled
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <p className="caption loan-block-caption">
                Automatically applied when a payment is late.
              </p>
            </div>
            <div className="loan-block loan-block-disabled">
              <div className="loan-switch-row">
                <span className="loan-switch-label">Send loan summaries</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={loanSummaries}
                    onChange={() => setLoanSummaries(v => !v)}
                    disabled
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <p className="caption loan-block-caption">
                Email the borrower with a summary of their loans. Includes a summary of payments due this month.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="settings-box">
        <div className="title-subtitle">
          <div className="title">Tags</div>
          <p className="subtitle">Use tags to categorize your loans.</p>
        </div>
        <div className="settings-caption">
          {/* Remplacer par CustomTagList de la bibliothèque si dispo */}
          <div className="custom-tag-list-instance">
            {/* CustomTagList ici */}
          </div>
        </div>
      </div>
    </div>
  );
}; 