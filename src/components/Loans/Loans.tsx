import { Button } from "@jbaluch/components";
import PropTypes from "prop-types";
import React from "react";
import "./style.css";
import '@jbaluch/components/styles';


interface Props {
  page: "all-loans";
  className?: string;
  imagesClassName?: string;
  imagesClassNameOverride?: string;
  divClassName?: string;
}

export const Loans = ({
  page,
  className = "",
  imagesClassName = "",
  imagesClassNameOverride = "",
  divClassName = "",
}: Props): JSX.Element => {
  return (
    <section className={`loans ${className}`}>
      <header className="page-toolbar">
        <div className="title-parent">
          <h1 className="title">Loans</h1>
          <p className="subtitle">Thursday, June 13</p>
        </div>

        <div className="search-filter-action">
          <button
            className="reset-button-filter"
            aria-label="Clear all filters"
          >
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
            <Button type="primary">
              Add
              <img
                className="arrow-drop-down"
                src="/icons/arrow-down.svg"
                alt="Dropdown"
              />
            </Button>
          </div>
        </div>
      </header>

      <section className="all-loans-table">
        <nav className="segmented-control" aria-label="Loan status filter">
          <button className="segmented-control-2" aria-pressed="true">
            <span className="text-wrapper">On Track</span>
            <span className="notification-badge-2">
              <span className="text-wrapper-2">2</span>
            </span>
          </button>

          <div className="rectangle" />

          <button className="segmented-control-3" aria-pressed="false">
            <span className="label-2">To Fund</span>
            <span className="notification-badge-3">
              <span className="text-wrapper-3">2</span>
            </span>
          </button>

          <div className="rectangle" />

          <button className="segmented-control-3" aria-pressed="false">
            <span className="label-3">Late</span>
            <span className="notification-badge-3">
              <span className="element-2">-</span>
            </span>
          </button>

          <div className="rectangle" />

          <button className="segmented-control-3" aria-pressed="false">
            <span className="label-2">Complete</span>
            <span className="notification-badge-3">
              <span className="text-wrapper-3">-</span>
            </span>
          </button>
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

          {/* Loan Row 1 */}
          <article className="loan-row">
            <div className="table-cell">
              <div className={`images ${imagesClassName}`} />
            </div>
            <div className="table-cell-2">
              <span className="label-5">Marcela&apos;s Tuition</span>
            </div>
            <div className="table-cell-2">
              <span className="label-5">Loan 1010</span>
            </div>
            <div className="tag-button-with-wrapper">
              <div className="div-3">
                <div className="tag-button-wrapper">
                  <div className="tag-button">
                    <div className="frame-5">
                      <div className="tag-color">
                        <div className="color" />
                      </div>
                    </div>
                    <span className="text-wrapper-4">1</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="metric-tag-wrapper">
              <div className="div-wrapper">
                <div className="tag">
                  <span className="label-6">1.43</span>
                </div>
              </div>
            </div>
            <div className="table-cell-2">
              <span className="label-7">$300.00</span>
            </div>
            <div className="frame-wrapper">
              <div className="frame-6">
                <span className="element-3">$6,016.17</span>
                <div className="progress-bar">
                  <div className="bar" />
                </div>
              </div>
            </div>
            <div className="loan-row-dropdown-wrapper">
              <div className="loan-row-dropdown">
                <div className="loan-row-dropdown-2">
                  <div className="div-3">
                    <div className="more-wrapper">
                      <img
                        className="more"
                        src="/icons/more.svg"
                        alt="More options"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Loan Row 2 */}
          <article className="loan-row-2">
            <div className="table-cell">
              <div className={`images ${imagesClassNameOverride}`} />
            </div>
            <div className="table-cell-2">
              <span className="label-5">New Phone</span>
            </div>
            <div className="table-cell-2">
              <span className="label-5">Loan 1011</span>
            </div>
            <div className="table-cell-3">
              <div className="tag-button-with">
                <div className="no-tag-button">
                  <img className="tag-2" src="/icons/tag.svg" alt="No tag" />
                </div>
              </div>
            </div>
            <div className="metric-tag-wrapper">
              <div className="div-wrapper">
                <div className="tag-3">
                  <span className="label-8">1.43</span>
                </div>
              </div>
            </div>
            <div className="table-cell-2">
              <span className="label-7">$300.00</span>
            </div>
            <div className="frame-wrapper">
              <div className="frame-6">
                <span className="element-3">$6,016.17</span>
                <div className="progress-bar">
                  <div className="bar-2" />
                </div>
              </div>
            </div>
            <div className="loan-row-dropdown-wrapper">
              <div className="loan-row-dropdown">
                <div className="loan-row-dropdown-2">
                  <div className="div-3">
                    <div className="more-wrapper">
                      <img
                        className="more-2"
                        src="/icons/more.svg"
                        alt="More options"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Loan Row 3 */}
          <article className="loan-row-3">
            <div className="images-wrapper">
              <div className={`images ${divClassName}`} />
            </div>
            <div className="table-cell-4">
              <span className="label-5">Vacation</span>
            </div>
            <div className="table-cell-4">
              <span className="label-5">Loan 1012</span>
            </div>
            <div className="table-cell-5">
              <div className="tag-button-with">
                <div className="no-tag-button">
                  <img className="tag-4" src="/icons/tag.svg" alt="No tag" />
                </div>
              </div>
            </div>
            <div className="table-cell-6">
              <div className="div-wrapper">
                <div className="tag-3">
                  <span className="label-8">1.43</span>
                </div>
              </div>
            </div>
            <div className="table-cell-4">
              <span className="label-7">$300.00</span>
            </div>
            <div className="table-cell-7">
              <div className="frame-6">
                <span className="element-3">$6,016.17</span>
                <div className="progress-bar">
                  <div className="bar-2" />
                </div>
              </div>
            </div>
            <div className="loan-row-dropdown-wrapper">
              <div className="loan-row-dropdown">
                <div className="loan-row-dropdown-2">
                  <div className="div-3">
                    <div className="more-wrapper">
                      <img
                        className="more-3"
                        src="/icons/more.svg"
                        alt="More options"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </section>
  );
};

Loans.propTypes = {
  page: PropTypes.oneOf(["all-loans"]).isRequired,
  className: PropTypes.string,
  imagesClassName: PropTypes.string,
  imagesClassNameOverride: PropTypes.string,
  divClassName: PropTypes.string,
};