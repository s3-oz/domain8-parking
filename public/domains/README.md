# Domain Assets

This directory contains domain-specific assets like logos, images, and other media.

## Structure
```
/public/domains/
  /[domain-name]/
    logo.png     # Primary logo
    favicon.ico  # Browser favicon
    og-image.png # Social media preview
    /images/     # Additional images
```

## Usage
Reference assets in configs using:
```json
"logo": "/domains/brewhaus.com.au/logo.png"
```