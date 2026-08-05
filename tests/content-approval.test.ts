import { describe, expect, test } from 'bun:test'
import { berswaraBusiness } from '../src/config/business'
import { getPublishedRentalProducts, rentalProducts } from '../src/data/rentalProducts'

describe('approved Berswara rental content', () => {
  test('publishes only the six approved products with their confirmed rates', () => {
    const expectedRates = {
      'cybex-libelle': [200_000, 275_000, 345_000, 415_000],
      'cocolatte-pockit-gen-7': [125_000, 200_000, 235_000, 325_000],
      'scoora-cronos-lite': [25_000, 45_000, 55_000, 65_000],
      'scoora-cronos-black': [25_000, 45_000, 55_000, 65_000],
      'fisher-price-zebra-walker': [60_000, 100_000],
      'balance-bike-rabbit-labelle': [50_000, 85_000],
    }

    expect(getPublishedRentalProducts()).toHaveLength(6)
    expect(rentalProducts.map((product) => product.slug)).toEqual(
      Object.keys(expectedRates),
    )

    for (const product of rentalProducts) {
      expect(product.rateOptions.every((rate) => rate.status === 'approved')).toBe(true)
      expect(product.rateOptions.map((rate) => rate.amount)).toEqual(
        expectedRates[product.slug as keyof typeof expectedRates],
      )
      expect(product.deposit.amount).toBeNull()
      expect(product.deposit.status).toBe('approved')
      expect(product.availability.exactDateConfirmationRequired).toBe(true)
    }
  })

  test('uses the approved public service information', () => {
    expect(berswaraBusiness.whatsapp.display).toBe('+62 819-9158-2500')
    expect(berswaraBusiness.hours).toBe('Senin–Sabtu, 07.00–17.00 WIB; Minggu libur')
    expect(berswaraBusiness.serviceArea).toBe('Kota Bandung dan Kabupaten Bandung')
    expect(berswaraBusiness.shopee).toBe('https://id.shp.ee/CxYkRRBu')
  })
})
