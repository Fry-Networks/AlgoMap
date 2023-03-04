import React, { useState } from "react"
import { Label, Input, Button, FormGroup, Form } from "reactstrap"
import { featureToH3Set } from "geojson2h3"

const sample = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-122.46092717828351, 37.77295937326589],
              [-122.46104799726534, 37.77298276352059],
              [-122.46113923694564, 37.77291042427848],
              [-122.46110965773332, 37.77281469483032],
              [-122.46120089718661, 37.772742355510026],
              [-122.46117131797716, 37.77264662595473],
              [-122.46105049945507, 37.772623235642094],
              [-122.46102092038917, 37.77252750590202],
              [-122.46090010192141, 37.77250411535596],
              [-122.46087052299909, 37.77240838543109],
              [-122.46074970458571, 37.772384994651595],
              [-122.4606584648648, 37.77245733382589],
              [-122.46068804364651, 37.77255306382838],
              [-122.4605968036986, 37.772625402924525],
              [-122.46047598487988, 37.772602011969504],
              [-122.46038474461581, 37.7726743509388],
              [-122.46041432325966, 37.772770080911755],
              [-122.46053514230829, 37.77279347183781],
              [-122.46056472109572, 37.77288920162597],
              [-122.46068554019871, 37.77291259231859],
              [-122.4607151191297, 37.773008321921985],
              [-122.46083593828706, 37.773031712381155],
              [-122.46092717828351, 37.77295937326589],
            ],
          ],
        ],
      },
    },
  ],
}

const GeoJSONInput = ({ onSubmit }) => {
  const [geoJSONInput, setGeoJSONInput] = useState("")

  function handleLoadFromJSON(e) {
    e.preventDefault()

    const validJSON = geoJSONInput.replace(/(\w+:)|(\w+ :)/g, function (s) {
      return '"' + s.substring(0, s.length - 1) + '":'
    })

    const pojo = JSON.parse(validJSON)

    const h3Indices = featureToH3Set(pojo, 12)
    const h3IndicesSet = new Set(h3Indices)

    onSubmit(h3IndicesSet)
  }

  return (
    <Form className="w-100" onSubmit={handleLoadFromJSON}>
      <FormGroup>
        <Label for="geojson-input">Add GeoJSON</Label>
        <Input
          value={geoJSONInput}
          onChange={(e) => setGeoJSONInput(e.target.value)}
          placeholder={JSON.stringify(sample, null, 4)}
          id="geojson-input"
          type="textarea"
          rows="9"
          cols="5"
        />
      </FormGroup>
      <Button disabled={!geoJSONInput} color="primary">
        Load from GeoJSON
      </Button>
    </Form>
  )
}

export default GeoJSONInput
