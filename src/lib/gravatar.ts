import { Md5 } from 'ts-md5'

/**
 * Generate a Gravatar URL from an email address
 * @param email - The email address to generate the Gravatar URL for
 * @param size - The size of the avatar in pixels (default: 80)
 * @param defaultImage - The default image to use if no Gravatar is found (default: "identicon")
 * @returns The Gravatar URL
 */
export function getGravatarUrl(
  email: string,
  size: number = 80,
  defaultImage:
    | '404'
    | 'mp'
    | 'identicon'
    | 'monsterid'
    | 'wavatar'
    | 'retro'
    | 'robohash'
    | 'blank' = '404',
): string {
  const hash = Md5.hashStr(email.trim().toLowerCase())
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`
}
