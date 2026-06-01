import * as Headless from '@headlessui/react'
import React, { forwardRef } from 'react'
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom'

type LinkProps = Omit<RouterLinkProps, 'to'> & {
  href: RouterLinkProps['to']
}

export const Link = forwardRef(function Link(
  { href, ...props }: LinkProps & React.ComponentPropsWithoutRef<'a'>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <Headless.DataInteractive>
      <RouterLink {...props} to={href} ref={ref} />
    </Headless.DataInteractive>
  )
})
