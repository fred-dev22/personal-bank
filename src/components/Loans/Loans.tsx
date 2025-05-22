import React, { useState } from "react";
import { Button } from "@jbaluch/components";
import "./style.css";
// @ts-expect-error: Non-typed external CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import type { Loan } from '../../types/types';

interface LoansProps {
  loans: Loan[];
  className?: string;
  imagesClassName?: string;
  imagesClassNameOverride?: string;
  divClassName?: string;
}

const statusTabs = [
  { key: 'on_track', label: 'On Track' },
  { key: 'to_fund', label: 'To Fund' },
  { key: 'late', label: 'Late' },
  { key: 'complete', label: 'Complete' },
];

export const Loans: React.FC<LoansProps> = ({
  loans,
  className = "",
  imagesClassName = "",
  imagesClassNameOverride = "",
  divClassName = "",
}) => {
  const [selectedStatus, setSelectedStatus] = useState<'on_track' | 'to_fund' | 'late' | 'complete'>('on_track');

  const filteredLoans = loans.filter(loan => loan.status === selectedStatus);

  const getStatusCount = (status: string) => loans.filter(loan => loan.status === status).length;

  return (
    <section className={`loans ${className}`}>
      <header className="page-toolbar">
        <div className="title-parent" style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <h1 className="title">Loans</h1>
          <p className="subtitle">Thursday, June 13</p>
        </div>
        <div className="search-filter-action">
          <button className="reset-button-filter" aria-label="Clear all filters">
            <span className="label">Clear All</span>
          </button>
          <div className="div-wrapper">
            <button className="icon-button" aria-label="Search">
              <div className="button">
                <img className="img" src="/icons/search.svg" alt="Search" />
              </div>
            </button>
          </div>
          <div className="div">
            <button className="icon-button" aria-label="Filter">
              <div className="button">
                <img className="img" src="/icons/filter.svg" alt="Filter" />
              </div>
            </button>
            <span className="notification-badge" aria-label="4 new filters">
              <span className="element">4</span>
            </span>
          </div>
          <div className="div-2">
            {/* @ts-expect-error: Button type from external library may not match expected props */}
            <Button type="primary">
              Add
              <img className="arrow-drop-down" src="/icons/arrow-down.svg" alt="Dropdown" />
            </Button>
          </div>
        </div>
      </header>
      <section className="all-loans-table">
        <nav className="segmented-control" aria-label="Loan status filter">
          {statusTabs.map(tab => (
            <React.Fragment key={tab.key}>
              <button
                className={
                  tab.key === selectedStatus
                    ? "segmented-control-2"
                    : "segmented-control-3"
                }
                aria-pressed={tab.key === selectedStatus}
                onClick={() => setSelectedStatus(tab.key as 'on_track' | 'to_fund' | 'late' | 'complete')}
              >
                <span className={
                  tab.key === 'on_track' ? 'text-wrapper' : tab.key === 'to_fund' ? 'label-2' : tab.key === 'late' ? 'label-3' : 'label-2'
                }>{tab.label}</span>
                <span className={
                  tab.key === 'on_track' ? 'notification-badge-2' : 'notification-badge-3'
                }>
                  <span className={
                    tab.key === 'on_track' ? 'text-wrapper-2' : tab.key === 'to_fund' ? 'text-wrapper-3' : tab.key === 'late' ? 'element-2' : 'text-wrapper-3'
                  }>
                    {getStatusCount(tab.key) > 0 ? getStatusCount(tab.key) : '-'}
                  </span>
                </span>
              </button>
              {tab.key !== 'complete' && <div className="rectangle" />}
            </React.Fragment>
          ))}
        </nav>
        <div className="on-track-loans">
          <div className="label-4">
            <div className="frame" />
            <div className="date-wrapper">
              <span className="date">Name</span>
            </div>
            <div className="date-wrapper">
              <span className="date">ID</span>
            </div>
            <div className="frame-2">
              <span className="date">Tag</span>
            </div>
            <div className="frame-2">
              <span className="date">DSCR</span>
            </div>
            <div className="frame-2">
              <span className="date">Payment due</span>
            </div>
            <div className="frame-3">
              <span className="date-2">Unpaid balance</span>
            </div>
            <div className="frame-4" />
          </div>
          {filteredLoans.map((loan, idx) => (
            <article
              key={loan.id}
              className={`loan-row${idx === 1 ? '-2' : idx === 2 ? '-3' : ''}`}
            >
              <div className="table-cell">
                <div className={`images ${idx === 0 ? imagesClassName : idx === 1 ? imagesClassNameOverride : divClassName}`} />
              </div>
              <div className={`table-cell${idx === 2 ? '-4' : idx === 1 ? '-2' : ''}`}>
                <span className="label-5">{loan.name}</span>
              </div>
              <div className={`table-cell${idx === 2 ? '-4' : idx === 1 ? '-2' : ''}`}>
                <span className="label-5">Loan {loan.id}</span>
              </div>
              <div className={loan.tag ? 'tag-button-with-wrapper' : idx === 1 ? 'table-cell-3' : idx === 2 ? 'table-cell-5' : 'tag-button-with-wrapper'}>
                {loan.tag ? (
                  <div className="div-3">
                    <div className="tag-button-wrapper">
                      <div className="tag-button">
                        <div className="frame-5">
                          <div className="tag-color">
                            <div className="color" />
                          </div>
                        </div>
                        <span className="text-wrapper-4">{loan.tag}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="tag-button-with">
                    <div className="no-tag-button">
                      <img className={idx === 1 ? 'tag-2' : idx === 2 ? 'tag-4' : 'tag-2'} src="/icons/tag.svg" alt="No tag" />
                    </div>
                  </div>
                )}
              </div>
              <div className={loan.tag ? 'metric-tag-wrapper' : idx === 2 ? 'table-cell-6' : 'metric-tag-wrapper'}>
                <div className="div-wrapper">
                  <div className={loan.tag ? 'tag' : idx === 2 ? 'tag-3' : 'tag-3'}>
                    <span className={loan.tag ? 'label-6' : 'label-8'}>{loan.dscr.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className={`table-cell${idx === 2 ? '-4' : idx === 1 ? '-2' : ''}`}>
                <span className="label-7">${loan.paymentDue.toFixed(2)}</span>
              </div>
              <div className={idx === 2 ? 'table-cell-7' : 'frame-wrapper'}>
                <div className="frame-6">
                  <span className="element-3">${loan.unpaidBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <div className="progress-bar">
                    <div className={idx === 0 ? 'bar' : 'bar-2'} />
                  </div>
                </div>
              </div>
              <div className="loan-row-dropdown-wrapper">
                <div className="loan-row-dropdown">
                  <div className="loan-row-dropdown-2">
                    <div className="div-3">
                      <div className="more-wrapper">
                        <img
                          className={`more${idx === 1 ? '-2' : idx === 2 ? '-3' : ''}`}
                          src="/icons/more.svg"
                          alt="More options"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};