import { setProjectAnnotations } from '@storybook/sveltekit';
import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import * as previewAnnotations from './preview';

setProjectAnnotations({
	...a11yAddonAnnotations,
	...previewAnnotations
});
