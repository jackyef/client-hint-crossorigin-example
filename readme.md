# Client hints example

Example of setting up client hints on webs that are using multiple origin, like `images.company.net` for images CDN.

## Requirements
- NodeJS v10

## Steps
- Install dependencies
  ```
  yarn
  ```

- Generate SSL certs for local usage using [mkcert](https://github.com/FiloSottile/mkcert)
  ```
  mkcert localhost-wildcard "localhost"
  ```

- Copy the generated files to `.ssl/key.pem` and `.ssl/cert.pem` (create the `.ssl` directory if you haven't)

- Run the static and web server 
  ```
  node static-server.js
  node web-server.js
  ```

- Go to `https://localhost:3000`. The image you are seeing will depend on your connection type.
  - If `4g`, you will get 900x900 image
  - If `3g`, you will get 700x700 image
  - If `2g`, you will get 300x300 image
  - If the browser doesn't sent `ECT` header (in unsupported browsers), you will get 500x500 image

- In `web-server.js`, if you omit `Feature-Policy` header, browser will only send client hint for same-origin requests (localhost:3000 in this case). If you do this, you should see that the image will be 500x500 again, because no client hints are sent to `localhost:3001` (where the images are hosted)


## Notes
- [Cross-origin client hints are currently not working on stable Chrome](https://cloudinary.com/blog/client_hints_and_responsive_images_what_changed_in_chrome_67). For now, to try this you need to use Chrome Canary (I used version 86).
- More details on the infrastructure can be read in the [Client Hints Infrastructure repo](https://github.com/WICG/client-hints-infrastructure)
- For Chrome on Android, `DPR` and `Viewport-Width` are still working based on [the discussion here](https://groups.google.com/a/chromium.org/g/blink-dev/c/8RBFue7RMXQ/m/x5ogQm7oBgAJ)
- Seems like crossorigin client-hints (via `Feature-Policy`) will be enabled in Chrome 84 🎉.
  - https://chromium-review.googlesource.com/c/chromium/src/+/2199266
  - https://mpulp.mobi/2020/05/20/client-hints-and-feature-policies/
