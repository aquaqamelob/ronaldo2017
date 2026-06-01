import { Avatar } from '@/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Navbar, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import {
  ArrowRightStartOnRectangleIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ChevronUpIcon,
  CloudArrowUpIcon,
  HomeIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
} from '@heroicons/react/16/solid'
import { useLocation } from 'react-router-dom'

function AccountDropdownMenu({ anchor }: { anchor: 'top start' | 'bottom end' }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="/login">
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Wyloguj</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export function ApplicationLayout({
  categories,
  children,
}: {
  categories: string[]
  children: React.ReactNode
}) {
  let { pathname } = useLocation()

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-xs font-medium text-zinc-500">Status Systemu</span>
              <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                Aktualny benchmark
              </span>
            </div>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarItem href="/">
              <SparklesIcon />
              <SidebarLabel>MedPrice Pro</SidebarLabel>
            </SidebarItem>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current={pathname === '/'}>
                <HomeIcon />
                <SidebarLabel>Przegląd</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/benchmarking" current={pathname.startsWith('/benchmarking')}>
                <ChartBarIcon />
                <SidebarLabel>Benchmarking</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/upload" current={pathname.startsWith('/upload')}>
                <CloudArrowUpIcon />
                <SidebarLabel>Import danych</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/recommendations" current={pathname.startsWith('/recommendations')}>
                <LightBulbIcon />
                <SidebarLabel>Rekomendacje</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/optimization" current={pathname.startsWith('/optimization')}>
                <ArrowTrendingUpIcon />
                <SidebarLabel>Optymalizacja</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Kategorie</SidebarHeading>
              {categories.map((category) => (
                <SidebarItem key={category} href={`/?category=${encodeURIComponent(category)}`}>
                  {category}
                </SidebarItem>
              ))}
            </SidebarSection>

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="#">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Wsparcie</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar initials="SK" className="size-10 bg-blue-600 text-white" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      Szpital Kliniczny Nr 1
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      Dział Zamówień Publicznych
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
