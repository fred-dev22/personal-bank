import React from "react";
import { MenuButton, EmptyState } from "@jbaluch/components";
// @ts-expect-error: Non-typed external CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import "./activities.css";


export const Activities: React.FC = () => {
  // Date du jour au format Thursday, June 13
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  return (
    <section className="activities">
      <header className="page-toolbar">
        <div className="page-header">
          <div className="page-header__title">Activity</div>
          <div className="page-header__subtitle">{formattedDate}</div>
        </div>
        <div className="search-filter-action">
          <MenuButton
            items={[]}
            label="Add"
            menuStyle="text"
            onItemClick={() => {}}
            type="primary"
            ariaLabel={undefined}
            aria-label="Add Activity"
            className="add-loan-btn"
          />
        </div>
      </header>
      <section className="all-activities-table">
        <div className="empty-state-center">
          <EmptyState
            imageName="NoActivity"
            title="No Activity"
            description="There is no activity to display at this time. Check back later for updates."
            customImage={undefined}
          />
        </div>
      </section>
    </section>
  );
}; 