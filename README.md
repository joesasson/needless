# Needless

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

## Scaffold

This script was scaffolded by yeoman [generator-clasp](https://github.com/joesasson/generator-clasp)

Visit link above for instructions on running this scaffold thorugh yeoman.


## Functions

- Turn an Amazon Commitment plan into a file suitable for upload as a Quickbooks PO
- Turn an Amazon Commitment plan into a Sku Creation Worksheet to be pasted (or uploaded) into qb

## Steps

- Select the "Stage Details" Sheet within the commitment plan
- extract asin, upc/ean, sku(model number and size name connected by underscore), and order quantity
- filter by date
- Next step is to run this script on multiple files within a folder

## Testing

[jest](https://jestjs.io) is being used for testing
Setup is pretty complicated, I should document how to set this up
