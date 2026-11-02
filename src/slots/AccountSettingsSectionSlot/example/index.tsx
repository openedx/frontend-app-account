import { useEffect, useRef } from 'react';
import { useLayoutOptions, useWidgets } from '@openedx/frontend-base';
import { Icon, IconButtonWithTooltip } from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';

/** Example widget: a hint inserted after one field. */
export const YearOfBirthHint = () => <p>Some courses have age requirements.</p>;

/** Example widget: a display-only notice that replaces one field. */
export const TimeZoneNotice = () => <p className="text-danger">Your time zone is set by your organization.</p>;

/**
 * Example section layout: adds an info tooltip beside each widget named in the `info` layout
 * option, a map of widget ID to tooltip text. Other widgets render unchanged.
 */
export const FieldInfoLayout = () => {
  const widgets = useWidgets();
  const { info = {} } = useLayoutOptions() as { info?: Record<string, string> };

  return (
    <>
      {widgets.identified.map(({ id, node }) => {
        if (!info[id]) {
          return node;
        }
        return (
          <div key={id} className="d-flex align-items-start">
            <div className="flex-grow-1">{node}</div>
            <IconButtonWithTooltip
              src={InfoOutline}
              iconAs={Icon}
              alt="Why do we ask for this?"
              tooltipPlacement="left"
              tooltipContent={info[id]}
              size="sm"
            />
          </div>
        );
      })}
    </>
  );
};

/**
 * Example section layout: wraps the widget named by the `highlight` layout option in a
 * bordered container and scrolls it into view. Other widgets render unchanged.
 */
export const SectionHighlightLayout = () => {
  const widgets = useWidgets();
  const { highlight } = useLayoutOptions() as { highlight?: string };
  const target = useRef<HTMLDivElement>(null);

  useEffect(() => {
    target.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlight]);

  return (
    <>
      {widgets.identified.map(({ id, node }) => (id === highlight
        ? <div key={id} ref={target} className="border border-warning rounded p-2 mb-3">{node}</div>
        : node))}
    </>
  );
};
