import { describe, it, expect } from 'vitest';
import HomeView from '../HomeView.vue';
import { mount } from '@vue/test-utils';

describe('HomeView', () => {
  it('should render', () => {
    const wrapper = mount(HomeView);
    expect(wrapper.html()).toContain('Home Page');
  });
});
