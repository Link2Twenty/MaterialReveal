export default interface MaterialRevealProps {
  /** classes to be added to the element */
  className: string | string[];
  /** variants to be added to the element */
  variant: string | string[];
  /** actions to be hidden behind the slider */
  actions: actionObject[];
  children: JSX.Element[] | JSX.Element;
}

interface actionObject {
  /** title to appear on mouse over and for screen readers */
  title: string;
  /** svg icon to be used as the action button */
  icon: JSX.Element;
  /** action to be performed onClick */
  action: Function;
}
