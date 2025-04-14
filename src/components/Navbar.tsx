'use client';

import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Fiserv', href: '/fiserv' },
  { name: 'Banks', href: '/banks' },
  { name: 'Brands', href: '/brands' },
  { name: 'Merchants', href: '/merchants' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="navbar">
      {({ open }) => (
        <>
          <div className="navbar-container">
            <div className="navbar-content">
              <div className="mobile-menu">
                <Disclosure.Button className="menu-button">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="icon" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="icon" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="nav-brand">
                <div className="brand-container">
                  <span className="brand-text">Payment Analytics</span>
                </div>
                <div className="desktop-menu">
                  <div className="nav-links">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          'nav-link',
                          pathname === item.href ? 'nav-link-active' : ''
                        )}
                        aria-current={pathname === item.href ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="mobile-nav-panel">
            <div className="mobile-nav-links">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={classNames(
                    'mobile-nav-link',
                    pathname === item.href ? 'mobile-nav-link-active' : ''
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
} 