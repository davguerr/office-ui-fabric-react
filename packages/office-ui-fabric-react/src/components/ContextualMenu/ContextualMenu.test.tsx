import * as React from 'react';
import { Promise } from 'es6-promise';
import * as ReactTestUtils from 'react-dom/test-utils';
import { KeyCodes, createRef } from '../../Utilities';
import { FocusZoneDirection } from '../../FocusZone';

import { IContextualMenuProps, IContextualMenuStyles } from './ContextualMenu.types';
import { ContextualMenu } from './ContextualMenu';
import { canAnyMenuItemsCheck } from './ContextualMenu.base';
import { IContextualMenuItem, ContextualMenuItemType } from './ContextualMenu.types';
import { IContextualMenuRenderItem, IContextualMenuItemStyles } from './ContextualMenuItem.types';

describe('ContextualMenu', () => {
  afterEach(() => {
    for (let i = 0; i < document.body.children.length; i++) {
      if (document.body.children[i].tagName === 'DIV') {
        document.body.removeChild(document.body.children[i]);
        i--;
      }
    }
  });

  it('allows setting aria-label per ContextualMenuItem', () => {
    const items: IContextualMenuItem[] = [{ text: 'Later Today', key: 'Today', secondaryText: '7:00 PM', ariaLabel: 'foo' }];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItemButtonEl = document.querySelector('.ms-ContextualMenu-link') as HTMLButtonElement;
    const ariaLabel = menuItemButtonEl.getAttribute('aria-label');

    expect(ariaLabel).toBe('foo');
  });

  // By default, do not set aria-label with value set to item text only.
  // This is to ensure that screen-readers read both primary and (optional) secondary text,
  // unless aria-label set explicitly. See https://github.com/OfficeDev/office-ui-fabric-react/pull/6670.
  it('by default aria-label is undefined per ContextualMenuItem', () => {
    const items: IContextualMenuItem[] = [{ text: 'Later Today', key: 'Today', secondaryText: '7:00 PM' }];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItemButtonEl = document.querySelector('.ms-ContextualMenu-link') as HTMLButtonElement;
    const hasAriaLabel = menuItemButtonEl.hasAttribute('aria-label');

    expect(hasAriaLabel).toBe(false);
  });

  it('renders secondary text if provided per ContextualMenuItem', () => {
    const items: IContextualMenuItem[] = [{ text: 'Later Today', key: 'Today', secondaryText: 'foo' }];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItemPrimaryText = document.querySelector('.ms-ContextualMenu-itemText') as HTMLSpanElement;
    const menuItemSecondaryText = document.querySelector('.ms-ContextualMenu-secondaryText') as HTMLSpanElement;

    expect(menuItemPrimaryText.textContent).toBe('Later Today');
    expect(menuItemSecondaryText.textContent).toBe('foo');
  });

  it('does not have a scrollbar due to an overflowing icon', () => {
    const items: IContextualMenuItem[] = [
      { text: 'TestText 1', key: 'TestKey1', canCheck: true, isChecked: true },
      { text: 'TestText 2', key: 'TestKey2', canCheck: true, isChecked: true },
      { text: 'TestText 3', key: 'TestKey3', canCheck: true, isChecked: true },
      { text: 'TestText 4', key: 'TestKey4', canCheck: true, isChecked: true }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuList = document.querySelector('.ms-ContextualMenu-list') as HTMLUListElement;

    expect(menuList.scrollHeight).toBeLessThanOrEqual(menuList.offsetHeight);
  });

  it('closes on left arrow if it is a submenu', () => {
    const items: IContextualMenuItem[] = [
      { text: 'TestText 1', key: 'TestKey1' },
      { text: 'TestText 2', key: 'TestKey2' },
      { text: 'TestText 3', key: 'TestKey3' },
      { text: 'TestText 4', key: 'TestKey4' }
    ];

    let spyCalled = false;
    const onDismissSpy = (ev?: any, dismissAll?: boolean) => {
      spyCalled = true;
    };

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} isSubMenu={true} onDismiss={onDismissSpy} />);

    const menuList = document.querySelector('ul.ms-ContextualMenu-list') as HTMLUListElement;
    ReactTestUtils.Simulate.keyDown(menuList, { which: KeyCodes.left });

    expect(spyCalled).toEqual(true);
  });

  it('menu closes on alt only', () => {
    const items: IContextualMenuItem[] = [
      { text: 'TestText 1', key: 'TestKey1' },
      { text: 'TestText 2', key: 'TestKey2' },
      { text: 'TestText 3', key: 'TestKey3' },
      { text: 'TestText 4', key: 'TestKey4' }
    ];

    let spyCalled = false;
    const onDismissSpy = (ev?: any, dismissAll?: boolean) => {
      spyCalled = true;
    };

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} onDismiss={onDismissSpy} />);

    const menuList = document.querySelector('ul.ms-ContextualMenu-list') as HTMLUListElement;
    ReactTestUtils.Simulate.keyDown(menuList, { which: KeyCodes.alt });
    ReactTestUtils.Simulate.keyUp(menuList, { which: KeyCodes.alt });

    expect(spyCalled).toEqual(true);
  });

  it('menu closes on alt + up arrow', () => {
    const items: IContextualMenuItem[] = [
      { text: 'TestText 1', key: 'TestKey1' },
      { text: 'TestText 2', key: 'TestKey2' },
      { text: 'TestText 3', key: 'TestKey3' },
      { text: 'TestText 4', key: 'TestKey4' }
    ];

    let spyCalled = false;
    const onDismissSpy = (ev?: any, dismissAll?: boolean) => {
      spyCalled = true;
    };

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} onDismiss={onDismissSpy} />);

    const menuList = document.querySelector('ul.ms-ContextualMenu-list') as HTMLUListElement;
    ReactTestUtils.Simulate.keyDown(menuList, { which: KeyCodes.up, altKey: true });

    expect(spyCalled).toEqual(true);
  });

  it('menu closes on alt + up arrow', () => {
    const items: IContextualMenuItem[] = [
      { text: 'TestText 1', key: 'TestKey1' },
      { text: 'TestText 2', key: 'TestKey2' },
      { text: 'TestText 3', key: 'TestKey3' },
      { text: 'TestText 4', key: 'TestKey4' }
    ];

    let spyCalled = false;
    const onDismissSpy = (ev?: any, dismissAll?: boolean) => {
      spyCalled = true;
    };

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} onDismiss={onDismissSpy} />);

    const menuList = document.querySelector('ul.ms-ContextualMenu-list') as HTMLUListElement;
    ReactTestUtils.Simulate.keyDown(menuList, { which: KeyCodes.escape });

    expect(spyCalled).toEqual(true);
  });

  it('menu does not close on alt + other key', () => {
    const items: IContextualMenuItem[] = [
      { text: 'TestText 1', key: 'TestKey1' },
      { text: 'TestText 2', key: 'TestKey2' },
      { text: 'TestText 3', key: 'TestKey3' },
      { text: 'TestText 4', key: 'TestKey4' }
    ];

    let spyCalled = false;
    const onDismissSpy = (ev?: any, dismissAll?: boolean) => {
      spyCalled = true;
    };

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} onDismiss={onDismissSpy} />);

    const menuList = document.querySelector('ul.ms-ContextualMenu-list') as HTMLUListElement;
    ReactTestUtils.Simulate.keyDown(menuList, { which: KeyCodes.alt });
    ReactTestUtils.Simulate.keyDown(menuList, { which: KeyCodes.a, altKey: true });
    ReactTestUtils.Simulate.keyUp(menuList, { which: KeyCodes.a, altKey: true });
    ReactTestUtils.Simulate.keyUp(menuList, { which: KeyCodes.alt });

    expect(spyCalled).toEqual(false);
  });

  it('does not close on left arrow if it is a submenu with horizontal arrowDirection', () => {
    const items: IContextualMenuItem[] = [
      { text: 'TestText 1', key: 'TestKey1' },
      { text: 'TestText 2', key: 'TestKey2' },
      { text: 'TestText 3', key: 'TestKey3' },
      { text: 'TestText 4', key: 'TestKey4' }
    ];

    let spyCalled = false;
    const onDismissSpy = (ev?: any, dismissAll?: boolean) => {
      spyCalled = true;
    };

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(
      <ContextualMenu
        items={items}
        isSubMenu={true}
        onDismiss={onDismissSpy}
        focusZoneProps={{ direction: FocusZoneDirection.horizontal }}
      />
    );

    const menuList = document.querySelector('ul.ms-ContextualMenu-list') as HTMLUListElement;
    ReactTestUtils.Simulate.keyDown(menuList, { which: KeyCodes.left });

    expect(spyCalled).toEqual(false);
  });

  it('does not close on left arrow if it is a submenu with bidirectional arrowDirection', () => {
    const items: IContextualMenuItem[] = [
      { text: 'TestText 1', key: 'TestKey1' },
      { text: 'TestText 2', key: 'TestKey2' },
      { text: 'TestText 3', key: 'TestKey3' },
      { text: 'TestText 4', key: 'TestKey4' }
    ];

    let spyCalled = false;
    const onDismissSpy = (ev?: any, dismissAll?: boolean) => {
      spyCalled = true;
    };

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(
      <ContextualMenu
        items={items}
        isSubMenu={true}
        onDismiss={onDismissSpy}
        focusZoneProps={{ direction: FocusZoneDirection.bidirectional }}
      />
    );

    const menuList = document.querySelector('ul.ms-ContextualMenu-list') as HTMLUListElement;
    ReactTestUtils.Simulate.keyDown(menuList, { which: KeyCodes.left });

    expect(spyCalled).toEqual(false);
  });

  it('opens a submenu item on right arrow', () => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        subMenuProps: {
          items: [
            {
              text: 'SubmenuText 1',
              key: 'SubmenuKey1',
              className: 'SubMenuClass'
            }
          ]
        }
      }
    ];
    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItem = document.querySelector('button.ms-ContextualMenu-link') as HTMLButtonElement;

    ReactTestUtils.Simulate.keyDown(menuItem, { which: KeyCodes.right });

    expect(document.querySelector('.SubMenuClass')).toBeDefined();
  });

  it('opens a submenu item on click', () => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        subMenuProps: {
          items: [
            {
              text: 'SubmenuText 1',
              key: 'SubmenuKey1',
              className: 'SubMenuClass'
            }
          ]
        }
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItem = document.querySelector('button.ms-ContextualMenu-link') as HTMLButtonElement;

    ReactTestUtils.Simulate.click(menuItem);

    expect(document.querySelector('.SubMenuClass')).toBeDefined();
  });

  it('opens a submenu item on alt+Down', () => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        subMenuProps: {
          items: [
            {
              text: 'SubmenuText 1',
              key: 'SubmenuKey1',
              className: 'SubMenuClass'
            }
          ]
        }
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItem = document.querySelector('button.ms-ContextualMenu-link') as HTMLButtonElement;
    ReactTestUtils.Simulate.keyDown(menuItem, { which: KeyCodes.down, altKey: true });

    expect(document.querySelector('.SubMenuClass')).toBeDefined();
  });

  it('closes a submenu item on alt+up', () => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        subMenuProps: {
          items: [
            {
              text: 'SubmenuText 1',
              key: 'SubmenuKey1',
              className: 'SubMenuClass'
            }
          ]
        }
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItem = document.querySelector('button.ms-ContextualMenu-link') as HTMLButtonElement;
    ReactTestUtils.Simulate.click(menuItem);
    let menuList = document.querySelectorAll('ul.ms-ContextualMenu-list');
    expect(menuList.length).toEqual(2);
    ReactTestUtils.Simulate.keyDown(menuList[1], { which: KeyCodes.up, altKey: true });
    menuList = document.querySelectorAll('ul.ms-ContextualMenu-list');
    expect(menuList.length).toEqual(1);

    expect(document.querySelector('.SubMenuClass')).toBeNull();
  });

  it('closes a submenu item on esc', () => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        subMenuProps: {
          items: [
            {
              text: 'SubmenuText 1',
              key: 'SubmenuKey1',
              className: 'SubMenuClass'
            }
          ]
        }
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItem = document.querySelector('button.ms-ContextualMenu-link') as HTMLButtonElement;
    ReactTestUtils.Simulate.click(menuItem);
    let menuList = document.querySelectorAll('ul.ms-ContextualMenu-list');
    expect(menuList.length).toEqual(2);
    ReactTestUtils.Simulate.keyDown(menuList[1], { which: KeyCodes.escape });
    menuList = document.querySelectorAll('ul.ms-ContextualMenu-list');
    expect(menuList.length).toEqual(1);

    expect(document.querySelector('.SubMenuClass')).toBeNull();
  });

  it('closes all menus on alt only', () => {
    let menuDismissed = false;
    let dismissedAll = false;
    const onDismiss = (ev?: any, dismissAll?: boolean) => {
      menuDismissed = true;
      dismissedAll = !!dismissAll;
    };
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        subMenuProps: {
          items: [
            {
              text: 'SubmenuText 1',
              key: 'SubmenuKey1',
              className: 'SubMenuClass'
            }
          ],
          onDismiss: onDismiss
        }
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItem = document.querySelector('button.ms-ContextualMenu-link') as HTMLButtonElement;
    ReactTestUtils.Simulate.click(menuItem);
    const menuList = document.querySelectorAll('ul.ms-ContextualMenu-list');
    expect(menuList.length).toEqual(2);
    ReactTestUtils.Simulate.keyDown(menuList[1], { which: KeyCodes.alt });
    ReactTestUtils.Simulate.keyUp(menuList[1], { which: KeyCodes.alt });
    expect(menuDismissed).toBeTruthy();
    expect(dismissedAll).toBeTruthy();
  });

  it('does not close any menus item alt + other key', () => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        subMenuProps: {
          items: [
            {
              text: 'SubmenuText 1',
              key: 'SubmenuKey1',
              className: 'SubMenuClass'
            }
          ]
        }
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItem = document.querySelector('button.ms-ContextualMenu-link') as HTMLButtonElement;
    ReactTestUtils.Simulate.click(menuItem);
    let menuList = document.querySelectorAll('ul.ms-ContextualMenu-list');
    expect(menuList.length).toEqual(2);
    ReactTestUtils.Simulate.keyDown(menuList[1], { which: KeyCodes.alt });
    ReactTestUtils.Simulate.keyDown(menuList[1], { which: KeyCodes.a, altKey: true });
    ReactTestUtils.Simulate.keyUp(menuList[1], { which: KeyCodes.a, altKey: true });
    ReactTestUtils.Simulate.keyUp(menuList[1], { which: KeyCodes.alt });
    menuList = document.querySelectorAll('ul.ms-ContextualMenu-list');
    expect(menuList.length).toEqual(2);

    expect(document.querySelector('.SubMenuClass')).toBeDefined();
  });

  it('opens a splitbutton submenu item on touch start', () => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        split: true,
        onClick: () => {
          alert('test');
        },
        subMenuProps: {
          items: [
            {
              text: 'SubmenuText 1',
              key: 'SubmenuKey1',
              className: 'SubMenuClass'
            }
          ]
        }
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItem = document.getElementsByTagName('button')[0] as HTMLButtonElement;

    // in a normal scenario, when we do a touchstart we would also cause a
    // click event to fire. This doesn't happen in the simulator so we're
    // manually adding this in.
    ReactTestUtils.Simulate.touchStart(menuItem);
    ReactTestUtils.Simulate.click(menuItem);

    expect(document.querySelector('.is-expanded')).toBeTruthy();
  });

  it('sets the correct aria-owns attribute for the submenu', () => {
    const submenuId = 'testSubmenuId';
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        subMenuProps: {
          id: submenuId,
          items: [
            {
              text: 'SubmenuText 1',
              key: 'SubmenuKey1',
              className: 'SubMenuClass'
            }
          ]
        }
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const parentMenuItem = document.querySelector('button.ms-ContextualMenu-link') as HTMLButtonElement;
    ReactTestUtils.Simulate.click(parentMenuItem);
    const childMenu = document.getElementById(submenuId);

    expect(childMenu!.id).toBe(submenuId);
    expect(parentMenuItem.getAttribute('aria-owns')).toBe(submenuId);
  });

  it('still works with deprecated IContextualMenuItem.items property', () => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        items: [
          {
            text: 'SubmenuText 1',
            key: 'SubmenuKey1',
            className: 'SubMenuClass'
          }
        ]
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItem = document.querySelector('button.ms-ContextualMenu-link') as HTMLButtonElement;
    ReactTestUtils.Simulate.keyDown(menuItem, { which: KeyCodes.right });

    expect(document.querySelector('.SubMenuClass')).toBeDefined();
  });

  it('can focus on disabled items', () => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1'
      },
      {
        text: 'TestText 2',
        key: 'TestKey2',
        disabled: true
      },
      {
        text: 'TestText 3',
        key: 'TestKey3',
        isDisabled: true
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItems = document.querySelectorAll('button.ms-ContextualMenu-link') as NodeListOf<HTMLButtonElement>;
    expect(menuItems.length).toEqual(3);

    menuItems[0].focus();
    expect(document.activeElement.textContent).toEqual('TestText 1');
    expect(document.activeElement.className.split(' ')).not.toContain('is-disabled');

    menuItems[1].focus();
    expect(document.activeElement.textContent).toEqual('TestText 2');
    expect(document.activeElement.className.split(' ')).toContain('is-disabled');

    menuItems[2].focus();
    expect(document.activeElement.textContent).toEqual('TestText 3');
    expect(document.activeElement.className.split(' ')).toContain('is-disabled');
  });

  it('cannot click on disabled items', () => {
    const itemsClicked = [false, false, false];
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        onClick: () => (itemsClicked[0] = true)
      },
      {
        text: 'TestText 2',
        key: 'TestKey2',
        disabled: true,
        onClick: () => {
          itemsClicked[1] = true;
          fail('Disabled item should not be clickable');
        }
      },
      {
        text: 'TestText 3',
        key: 'TestKey3',
        isDisabled: true,
        onClick: () => {
          itemsClicked[2] = true;
          fail('Disabled item should not be clickable');
        }
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItems = document.querySelectorAll('button.ms-ContextualMenu-link') as NodeListOf<HTMLButtonElement>;
    expect(menuItems.length).toEqual(3);

    menuItems[0].click();
    expect(itemsClicked[0]).toEqual(true);

    menuItems[1].click();
    expect(itemsClicked[1]).toEqual(false);

    menuItems[2].click();
    expect(itemsClicked[2]).toEqual(false);
  });

  it('renders headers properly', () => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        itemType: ContextualMenuItemType.Header
      },
      {
        text: 'TestText 2',
        key: 'TestKey3'
      },
      {
        text: 'TestText 3',
        key: 'TestKey3',
        itemType: ContextualMenuItemType.Header
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItems = document.querySelectorAll('li');

    expect(menuItems.length).toEqual(4);
    const headerOne = menuItems[0];
    const dividerOne = menuItems[2];
    const headerTwo = menuItems[3];

    expect(headerOne.className).not.toEqual(expect.stringMatching('divider'));
    expect(headerOne.firstElementChild!.className).toEqual(expect.stringMatching('header'));
    expect(dividerOne.className).toEqual(expect.stringMatching('divider'));
    expect(headerTwo.firstElementChild!.className).toEqual(expect.stringMatching('header'));
  });

  it('renders sections properly', () => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        itemType: ContextualMenuItemType.Section,
        sectionProps: {
          key: 'Section1',
          topDivider: true,
          bottomDivider: true,
          items: [
            {
              text: 'TestText 2',
              key: 'TestKey2'
            },
            {
              text: 'TestText 3',
              key: 'TestKey3'
            }
          ]
        }
      },
      {
        text: 'TestText 4',
        key: 'TestKey4',
        itemType: ContextualMenuItemType.Section,
        sectionProps: {
          key: 'Section1',
          items: [
            {
              text: 'TestText 5',
              key: 'TestKey5'
            },
            {
              text: 'TestText 6',
              key: 'TestKey6'
            }
          ]
        }
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const menuItems = document.querySelectorAll('li');
    expect(menuItems.length).toEqual(8);
  });

  describe('with links', () => {
    const testUrl = 'http://test.com';
    let items: IContextualMenuItem[];
    let menuItems: NodeListOf<Element>;
    let linkNoTarget: Element;
    let linkBlankTarget: Element;
    let linkBlankTargetAndRel: Element;
    let linkSelfTarget: Element;
    let linkNoTargetAndRel: Element;

    beforeEach(() => {
      items = [
        {
          text: 'TestText 1',
          key: 'TestKey1',
          href: testUrl
        },
        {
          text: 'TestText 2',
          key: 'TestKey2',
          href: testUrl,
          target: '_blank'
        },
        {
          text: 'TestText 3',
          key: 'TestKey3',
          href: testUrl,
          target: '_blank',
          rel: 'test'
        },
        {
          text: 'TestText 4',
          key: 'TestKey4',
          href: testUrl,
          target: '_self'
        },
        {
          text: 'TestText 5',
          key: 'TestKey5',
          href: testUrl,
          rel: 'test'
        }
      ];

      ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

      menuItems = document.querySelectorAll('li a');
      linkNoTarget = menuItems[0];
      linkBlankTarget = menuItems[1];
      linkBlankTargetAndRel = menuItems[2];
      linkSelfTarget = menuItems[3];
      linkNoTargetAndRel = menuItems[4];
    });

    it('should render an anchor with the passed href', () => {
      expect(linkNoTarget.getAttribute('href')).toEqual(testUrl);
    });

    describe('with target passed', () => {
      it('should render with the specified target', () => {
        expect(linkSelfTarget.getAttribute('target')).toEqual('_self');
      });

      it('should not default the rel if the target is not _blank', () => {
        expect(linkSelfTarget.getAttribute('rel')).toBeNull();
      });

      describe('when the target is _blank and there is no rel specified', () => {
        it('should default a rel to prevent clickjacking', () => {
          expect(linkBlankTarget.getAttribute('rel')).toEqual('nofollow noopener noreferrer');
        });
      });

      describe('when the target is _blank and there is a rel specified', () => {
        it('should use the specified rel', () => {
          expect(linkBlankTargetAndRel.getAttribute('rel')).toEqual('test');
        });
      });
    });

    describe('with rel passed', () => {
      it('should add the specified rel', () => {
        expect(linkNoTargetAndRel.getAttribute('rel')).toEqual('test');
      });
    });
  });

  it('does not return a value if no items are given', () => {
    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={[]} />);
    const menuList = document.querySelector('.ms-ContextualMenu-list');

    expect(menuList).toBeNull();
  });

  it('correctly focuses the first element', done => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        className: 'testkey1'
      },
      {
        text: 'TestText 2',
        key: 'TestKey2'
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    new Promise<any>(resolve => {
      let focusedItem;
      for (let i = 0; i < 20; i++) {
        focusedItem = document.querySelector('.testkey1')!.firstChild;
        if (focusedItem === document.activeElement) {
          break;
        }
      }
      expect(document.activeElement).toEqual(focusedItem);
      done();
      resolve();
    }).catch(done());
  });

  it('will not focus the first element when shouldFocusOnMount is false', done => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        className: 'testkey1'
      },
      {
        text: 'TestText 2',
        key: 'TestKey2'
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} shouldFocusOnMount={true} />);
    new Promise(resolve => {
      let focusedItem;
      for (let i = 0; i < 20; i++) {
        focusedItem = document.querySelector('.testkey1')!.firstChild;
        if (focusedItem === document.activeElement) {
          break;
        }
      }
      expect(document.activeElement).not.toEqual(focusedItem);
      done();
      resolve();
    }).catch(done);
  });

  it('Hover correctly focuses the second element', done => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        className: 'testkey1'
      },
      {
        text: 'TestText 2',
        key: 'TestKey2',
        className: 'testkey2'
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    new Promise<any>(resolve => {
      let focusedItem;
      for (let i = 0; i < 20; i++) {
        focusedItem = document.querySelector('.testkey2')!.firstChild;

        if (focusedItem) {
          const focusedItemElement = focusedItem as HTMLElement;
          const eventObject = document.createEvent('Events');
          eventObject.initEvent('mouseenter', true, false);
          focusedItemElement.dispatchEvent(eventObject);
        }
        if (focusedItem === document.activeElement) {
          break;
        }
      }
      expect(document.activeElement).toEqual(focusedItem);
      done();
      resolve();
    }).catch(done());
  });

  it('merges callout classNames', () => {
    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(
      <ContextualMenu
        items={[
          {
            text: 'TestText 0',
            key: 'TestKey0'
          }
        ]}
        calloutProps={{ className: 'foo' }}
      />
    );

    const callout = document.querySelector('.ms-Callout') as HTMLElement;
    expect(callout).toBeDefined();
    expect(callout.classList.contains('ms-ContextualMenu-Callout')).toBeTruthy();
    expect(callout.classList.contains('foo')).toBeTruthy();
  });

  it('Contextual Menu submenu has chrevron icon even if submenu has no items', () => {
    const menuWithEmptySubMenu: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        subMenuProps: {
          items: []
        }
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={menuWithEmptySubMenu} />);

    const menuItem = document.querySelector('button.ms-ContextualMenu-link') as HTMLButtonElement;

    expect(menuItem.querySelector('.ms-ContextualMenu-submenuIcon')).not.toEqual(null);
  });

  it('Contextual Menu submenu calls onMenuOpened on click even if submenu has no items', () => {
    let subMenuOpened = false;

    const onSubMenuOpened = (): void => {
      subMenuOpened = true;
    };

    const menuWithEmptySubMenu: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        subMenuProps: {
          items: [],
          onMenuOpened: onSubMenuOpened
        }
      }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={menuWithEmptySubMenu} />);

    const menuItem = document.querySelector('button.ms-ContextualMenu-link') as HTMLButtonElement;

    ReactTestUtils.Simulate.click(menuItem);

    expect(subMenuOpened).toEqual(true);
  });

  it('calls the custom child renderer when the contextualMenuItemAs prop is provided', () => {
    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1'
      },
      {
        text: 'TestText 2',
        key: 'TestKey2'
      }
    ];
    const customRenderer = jest.fn(() => null);

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} contextualMenuItemAs={customRenderer} />);

    const menuItem = document.querySelector('button.ms-ContextualMenu-link') as HTMLButtonElement;
    ReactTestUtils.Simulate.click(menuItem);

    expect(customRenderer).toHaveBeenCalledTimes(2);
  });

  describe('canAnyMenuItemsCheck', () => {
    it('returns false when there are no checkable menu items', () => {
      const items: IContextualMenuItem[] = [
        { text: 'Item 1', key: 'Item 1' },
        { text: 'Item 2', key: 'Item 2' },
        { text: 'Item 3', key: 'Item 3' }
      ];

      expect(canAnyMenuItemsCheck(items)).toEqual(false);
    });

    it('returns true when there is at least one checkable menu item', () => {
      const items: IContextualMenuItem[] = [
        { text: 'Item 1', key: 'Item 1' },
        { text: 'Item 2', key: 'Item 2', canCheck: true },
        { text: 'Item 3', key: 'Item 3' }
      ];

      expect(canAnyMenuItemsCheck(items)).toEqual(true);
    });

    it('returns true when there is a menu section with an item that can check', () => {
      const items: IContextualMenuItem[] = [
        {
          text: 'Item 1',
          key: 'Item 1'
        },
        {
          text: 'Item 2',
          key: 'Item 2'
        },
        {
          text: 'Item 3',
          key: 'Item 3',
          sectionProps: {
            key: 'Section1',
            items: [{ text: 'Item 1', key: 'Item 1' }, { text: 'Item 2', key: 'Item 2', canCheck: true }, { text: 'Item 3', key: 'Item 3' }]
          }
        }
      ];

      expect(canAnyMenuItemsCheck(items)).toEqual(true);
    });
  });

  describe('IContextualMenuRenderItem function tests', () => {
    const contextualItem = createRef<IContextualMenuRenderItem>();
    let menuDismissed: boolean;
    const onDismiss = (ev?: any, dismissAll?: boolean) => {
      menuDismissed = true;
    };

    describe('for a button element', () => {
      beforeEach(() => {
        menuDismissed = false;
        const menu: IContextualMenuItem[] = [
          {
            text: 'Test1',
            key: 'Test1',
            componentRef: contextualItem,
            subMenuProps: {
              items: [
                {
                  text: 'Test2',
                  key: 'Test2',
                  className: 'SubMenuClass'
                },
                {
                  text: 'Test3',
                  key: 'Test3',
                  className: 'SubMenuClass'
                }
              ]
            }
          }
        ];
        ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu onDismiss={onDismiss} items={menu} />);
      });

      it('openSubMenu will open the item`s submenu if present', () => {
        contextualItem.value!.openSubMenu();
        expect(document.querySelector('.SubMenuClass')).not.toEqual(null);
      });

      it('dismissSubMenu will close the item`s submenu if present', () => {
        contextualItem.value!.openSubMenu();
        expect(document.querySelector('.SubMenuClass')).not.toEqual(null);
        contextualItem.value!.dismissSubMenu();
        expect(document.querySelector('.SubMenuClass')).toEqual(null);
      });

      it('dismissMenu will close the item`s menu', () => {
        contextualItem.value!.dismissMenu();
        expect(menuDismissed).toEqual(true);
      });
    });

    describe('for a split button element', () => {
      beforeEach(() => {
        menuDismissed = false;
        const menu: IContextualMenuItem[] = [
          {
            text: 'Test1',
            key: 'Test1',
            componentRef: contextualItem,
            split: true,
            subMenuProps: {
              items: [
                {
                  text: 'Test2',
                  key: 'Test2',
                  className: 'SubMenuClass'
                },
                {
                  text: 'Test3',
                  key: 'Test3',
                  className: 'SubMenuClass'
                }
              ]
            }
          }
        ];
        ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu onDismiss={onDismiss} items={menu} />);
      });

      it('openSubMenu will open the item`s submenu if present', () => {
        contextualItem.value!.openSubMenu();
        expect(document.querySelector('.SubMenuClass')).not.toEqual(null);
      });

      it('dismissSubMenu will close the item`s submenu if present', () => {
        contextualItem.value!.openSubMenu();
        expect(document.querySelector('.SubMenuClass')).not.toEqual(null);
        contextualItem.value!.dismissSubMenu();
        expect(document.querySelector('.SubMenuClass')).toEqual(null);
      });

      it('dismissMenu will close the item`s menu', () => {
        contextualItem.value!.dismissMenu();
        expect(menuDismissed).toEqual(true);
      });
    });

    describe('for an anchor element', () => {
      beforeEach(() => {
        menuDismissed = false;
        const menu: IContextualMenuItem[] = [
          {
            text: 'Test1',
            key: 'Test1',
            componentRef: contextualItem,
            href: '#test',
            subMenuProps: {
              items: [
                {
                  text: 'Test2',
                  key: 'Test2',
                  className: 'SubMenuClass'
                },
                {
                  text: 'Test3',
                  key: 'Test3',
                  className: 'SubMenuClass'
                }
              ]
            }
          }
        ];
        ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu onDismiss={onDismiss} items={menu} />);
      });

      it('openSubMenu will open the item`s submenu if present', () => {
        contextualItem.value!.openSubMenu();
        expect(document.querySelector('.SubMenuClass')).not.toEqual(null);
      });

      it('dismissSubMenu will close the item`s submenu if present', () => {
        contextualItem.value!.openSubMenu();
        expect(document.querySelector('.SubMenuClass')).not.toEqual(null);
        contextualItem.value!.dismissSubMenu();
        expect(document.querySelector('.SubMenuClass')).toEqual(null);
      });

      it('dismissMenu will close the item`s menu', () => {
        contextualItem.value!.dismissMenu();
        expect(menuDismissed).toEqual(true);
      });
    });
  });

  it('applies styles prop for menu if provided', () => {
    const items: IContextualMenuItem[] = [
      { text: 'TestText 1', key: 'TestKey1', canCheck: true, isChecked: true },
      { text: 'TestText 2', key: 'TestKey2', canCheck: true, isChecked: true },
      { text: 'TestText 3', key: 'TestKey3', canCheck: true, isChecked: true },
      { text: 'TestText 4', key: 'TestKey4', canCheck: true, isChecked: true }
    ];

    const getCustomStyles = (): IContextualMenuStyles => {
      return {
        container: 'containerFoo',
        root: 'rootFoo',
        list: 'listFoo',
        header: 'headerFoo',
        title: 'titleFoo'
      };
    };

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} styles={getCustomStyles} />);

    const container = document.querySelector('.containerFoo') as HTMLElement;
    const rootEl = document.querySelector('.rootFoo') as HTMLElement;
    const list = document.querySelector('.listFoo') as HTMLElement;
    const header = document.querySelector('.ms-ContextualMenu-header') as HTMLElement;
    const title = document.querySelector('.ms-ContextualMenu-title') as HTMLElement;

    expect(container).toBeDefined();
    expect(rootEl).toBeDefined();
    expect(list).toBeDefined();
    expect(header).toBeDefined();
    expect(title).toBeDefined();
  });

  it('applies styles per ContextualMenuItem if provided', () => {
    const getCustomItemStyles = (): Partial<IContextualMenuItemStyles> => {
      return {
        linkContent: 'linkContentFoo'
      };
    };

    const items: IContextualMenuItem[] = [
      {
        text: 'TestText 1',
        key: 'TestKey1',
        canCheck: true,
        isChecked: true,
        itemProps: { styles: getCustomItemStyles }
      },
      { text: 'TestText 2', key: 'TestKey2', canCheck: true, isChecked: true },
      { text: 'TestText 3', key: 'TestKey3', canCheck: true, isChecked: true },
      { text: 'TestText 4', key: 'TestKey4', canCheck: true, isChecked: true }
    ];

    ReactTestUtils.renderIntoDocument<IContextualMenuProps>(<ContextualMenu items={items} />);

    const customLinkContentEls = document.querySelectorAll('.linkContentFoo') as NodeListOf<HTMLElement>;

    expect(customLinkContentEls.length).toBe(1);
  });
});
