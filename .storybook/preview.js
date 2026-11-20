import { themes } from '@storybook/theming';
import '../src/components/index.js';
import '../src/gallery/gallery.css';

// Catalyst DS 2.0: density switch in the toolbar (sets data-density on <html>, like IFS.setDensity)
const withDensity = (Story, ctx) => {
  document.documentElement.setAttribute('data-density', ctx.globals.density || 'comfortable');
  return Story();
};
// Direction switch (sets dir on <html>, like IFS.setDirection): RTL for the Arabic market
const withDirection = (Story, ctx) => {
  document.documentElement.setAttribute('dir', ctx.globals.direction === 'rtl' ? 'rtl' : 'ltr');
  return Story();
};

/** @type { import('@storybook/react').Preview } */
export default {
  globalTypes: {
    density: {
      description: 'Density (user Display setting)',
      defaultValue: 'comfortable',
      toolbar: {
        title: 'Density', icon: 'component', dynamicTitle: true,
        items: [
          { value: 'spacious', title: 'Spacious (16 px)' },
          { value: 'comfortable', title: 'Comfortable (14 px)' },
          { value: 'compact', title: 'Compact (12 px)' },
        ],
      },
    },
    direction: {
      description: 'Direction (RTL for Arabic)',
      defaultValue: 'ltr',
      toolbar: {
        title: 'Direction', icon: 'transfer', dynamicTitle: true,
        items: [
          { value: 'ltr', title: 'Left to right' },
          { value: 'rtl', title: 'Right to left' },
        ],
      },
    },
  },
  decorators: [withDensity, withDirection],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'page', values: [{ name: 'page', value: '#000000' }] },
    docs: { theme: themes.dark },
    controls: { expanded: true },
    options: { storySort: { order: ['Introduction', 'Review queue', 'Foundations', ['Colour', 'Typography', 'Spacing', 'Sizes', 'Layout', 'Shape and effects'], 'Action', 'Action & Input Extras', 'Inputs & Forms', 'Selection', 'Navigation', 'Surfaces & Feedback', 'Content States & Cooper', 'Data Display', 'Activity & Collaboration', 'Data Visualisation', 'Map & Canvas', 'More components', 'Pattern helpers', 'Examples'] } },
  },
};
