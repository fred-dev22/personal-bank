
export const Activity = () => {
  return (
    <div className="settings">
      <div className="settings-box">
        <div className="title-subtitle">
          <div className="title">Reconcile</div>
          <p className="subtitle">Lock activities after you review them.</p>
        </div>
        <div className="settings-caption">
          {/* ReconcileSettings à remplacer par le composant de ta bibliothèque si dispo */}
          <div className="reconcile-settings">
            <div className="reconcile-switch-row">
              <span className="reconcile-switch-label">Reconcile activity</span>
              <label className="switch">
                <input type="checkbox" disabled />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="reconcile-switch-row">
              <span className="reconcile-switch-label">Auto-reconcile monthly</span>
              <label className="switch">
                <input type="checkbox" disabled />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="reconcile-switch-row">
              <span className="reconcile-switch-label">Set reconcile password</span>
              <label className="switch">
                <input type="checkbox" disabled />
                <span className="slider round"></span>
              </label>
            </div>
            <p className="caption reconcile-caption">
              A password will be needed to change reconciled activity.
            </p>
          </div>
        </div>
        <div className="read-more">
          <div className="text-button-wrapper">
            {/* Remplacer par TextButton de la bibliothèque si dispo */}
            <a className="text-button" href="#" tabIndex={-1}>
              Read More About Reconciliation <span className="chevron">›</span>
            </a>
          </div>
        </div>
      </div>
      <div className="settings-box">
        <div className="title-subtitle">
          <div className="title">Custom categories</div>
          <p className="subtitle">Organize your activities your way.</p>
        </div>
        <div className="settings-caption">
          {/* Remplacer par CustomCategoryList de la bibliothèque si dispo */}
          <div className="custom-category-list-instance">
            <div className="category-row"><span role="img" aria-label="emoji">🟡</span> Custom 1 <button className="delete-btn">🗑️</button></div>
            <div className="category-row"><span role="img" aria-label="emoji">🟡</span> Custom 2 <button className="delete-btn">🗑️</button></div>
            <div className="category-row"><span role="img" aria-label="emoji">🟡</span> Custom 3 <button className="delete-btn">🗑️</button></div>
          </div>
          <div className="category-caption">You must remove a category from all activities to delete it.</div>
        </div>
        {/* Remplacer par Button de la bibliothèque si dispo */}
        <button className="add-category-btn">
          + new category
        </button>
      </div>
    </div>
  );
}; 