import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Slider } from '@/components/ui/slider'

type FilterOptions = {
  serviceTypes: string[]
  medicationTypes: {
    methadone: string[]
    suboxone: string[]
    lais: string[]
  }
  additionalServices: {
    housing: string[]
    food: string[]
    mentalHealth: string[]
    caseManagement: string[]
  }
  insuranceOptions: string[]
  location: {
    zipCode: string
    address: string
    useCurrentLocation: boolean
  }
  radius: number
}

type FilterPanelProps = {
  onFilterChange: (filters: FilterOptions) => void
  onFilterClick: (filterValue: string) => void
  setInput: React.Dispatch<React.SetStateAction<string>>
  onReset: () => void
}

const initialFilters: FilterOptions = {
  serviceTypes: [],
  medicationTypes: {
    methadone: [],
    suboxone: [],
    lais: []
  },
  additionalServices: {
    housing: [],
    food: [],
    mentalHealth: [],
    caseManagement: []
  },
  insuranceOptions: [],
  location: {
    zipCode: '',
    address: '',
    useCurrentLocation: false
  },
  radius: 5
}

export function FilterPanel({ onFilterChange, onFilterClick, setInput, onReset }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters)

  const handleFilterChange = (category: string, value: string | string[] | boolean | number) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters }
      if (category.includes('.')) {
        const [mainCategory, subCategory] = category.split('.')
        newFilters[mainCategory as keyof FilterOptions][subCategory] = value
      } else {
        newFilters[category as keyof FilterOptions] = value
      }
      return newFilters
    })
  }

  const handleCheckboxChange = (category: string, value: string, checked: boolean) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters }
      if (category.includes('.')) {
        const [mainCategory, subCategory] = category.split('.')
        const currentValues = (newFilters[mainCategory as keyof FilterOptions]?.[subCategory] as string[]) || []
        if (checked) {
          if (!currentValues.includes(value)) {
            newFilters[mainCategory as keyof FilterOptions][subCategory] = [...currentValues, value]
          }
        } else {
          newFilters[mainCategory as keyof FilterOptions][subCategory] = currentValues.filter(v => v !== value)
        }
      } else {
        const currentValues = (newFilters[category as keyof FilterOptions] as string[]) || []
        if (checked) {
          if (!currentValues.includes(value)) {
            newFilters[category as keyof FilterOptions] = [...currentValues, value]
          }
        } else {
          newFilters[category as keyof FilterOptions] = currentValues.filter(v => v !== value)
        }
      }
      return newFilters
    })
    handleCommaChange(value, checked)
  }

  const handleCommaChange = (value: string, isChecked: boolean) => {
    setInput(prevInput => {
      const values = prevInput.split(',').map(v => v.trim())
      if (isChecked) {
        if (!values.includes(value)) {
          values.push(value)
        }
      } else {
        const index = values.indexOf(value)
        if (index > -1) {
          values.splice(index, 1)
        }
      }
      return values.join(', ')
    })
  }

  const resetFilters = () => {
    setFilters(initialFilters)
    onReset()
  }

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  return (
    <div className="w-80 p-4 bg-gray-100 rounded-lg overflow-y-auto h-screen">
      <h2 className="text-lg font-semibold mb-4">Filters & Categories</h2>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="service-type">
          <AccordionTrigger>Service Type</AccordionTrigger>
          <AccordionContent>
            {['Behavioral Health', 'Substance Abuse', 'Homelessness Assistance', 'Medication Services', 'General Health Services', 'Peer Support', 'Education and Advocacy'].map((service) => (
              <div key={service} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={`service-${service}`}
                  checked={filters.serviceTypes?.includes(service) ?? false}
                  onCheckedChange={(checked) => {
                    handleCheckboxChange('serviceTypes', service, checked)
                    handleCommaChange(service, checked)
                  }}
                />
                <Label htmlFor={`service-${service}`}>{service}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="medication-type">
          <AccordionTrigger>Medication Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {['Methadone', 'Suboxone', 'Long-Acting Injectables (LAIs)'].map((medication) => (
                <div key={medication}>
                  <h4 className="font-semibold mb-2">{medication}</h4>
                  {['Induction', 'Maintenance', 'Detox'].map((type) => (
                    <div key={`${medication}-${type}`} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`${medication}-${type}`}
                        checked={filters.medicationTypes[medication.toLowerCase().split(' ')[0] as keyof typeof filters.medicationTypes]?.includes(type) ?? false}
                        onCheckedChange={(checked) => {
                          handleCheckboxChange(`medicationTypes.${medication.toLowerCase().split(' ')[0]}`, type, checked)
                          handleCommaChange(type, checked)
                        }}
                      />
                      <Label htmlFor={`${medication}-${type}`}>{type}</Label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="additional-services">
          <AccordionTrigger>Additional Services</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Housing Assistance</h4>
                {['Shelter for Men', 'Shelter for Women', 'Transitional Housing', 'Permanent Housing'].map((housing) => (
                  <div key={housing} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`housing-${housing}`}
                      checked={filters.additionalServices.housing?.includes(housing) ?? false}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange('additionalServices.housing', housing, checked)
                        handleCommaChange(housing, checked)
                      }}
                    />
                    <Label htmlFor={`housing-${housing}`}>{housing}</Label>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Food Support</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id="food-banks"
                    checked={filters.additionalServices.food?.includes('Food Banks') ?? false}
                    onCheckedChange={(checked) => {
                      handleCheckboxChange('additionalServices.food', 'Food Banks', checked)
                      handleCommaChange('Food Banks', checked)
                    }}
                  />
                  <Label htmlFor="food-banks">Food Banks</Label>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Meal Services</h5>
                  {['Weekdays', 'Weekends', 'Everyday'].map((mealService) => (
                    <div key={mealService} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`meal-${mealService}`}
                        checked={filters.additionalServices.food?.includes(mealService) ?? false}
                        onCheckedChange={(checked) => {
                          handleCheckboxChange('additionalServices.food', mealService, checked)
                          handleCommaChange(mealService, checked)
                        }}
                      />
                      <Label htmlFor={`meal-${mealService}`}>{mealService}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mental Health Support</h4>
                {['Therapy and Counseling', 'Psychiatric Services'].map((mentalHealth) => (
                  <div key={mentalHealth} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`mental-health-${mentalHealth}`}
                      checked={filters.additionalServices.mentalHealth?.includes(mentalHealth) ?? false}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange('additionalServices.mentalHealth', mentalHealth, checked)
                        handleCommaChange(mentalHealth, checked)
                      }}
                    />
                    <Label htmlFor={`mental-health-${mentalHealth}`}>{mentalHealth}</Label>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Case Management</h4>
                {['Individualized Case Support', 'Family Support Services'].map((caseManagement) => (
                  <div key={caseManagement} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`case-management-${caseManagement}`}
                      checked={filters.additionalServices.caseManagement?.includes(caseManagement) ?? false}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange('additionalServices.caseManagement', caseManagement, checked)
                        handleCommaChange(caseManagement, checked)
                      }}
                    />
                    <Label htmlFor={`case-management-${caseManagement}`}>{caseManagement}</Label>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="insurance-options">
          <AccordionTrigger>Insurance Options</AccordionTrigger>
          <AccordionContent>
            {['Medicaid', 'Private Insurance', 'Sliding Scale Fees', 'Uninsured Support'].map((insurance) => (
              <div key={insurance} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={`insurance-${insurance}`}
                  checked={filters.insuranceOptions?.includes(insurance) ?? false}
                  onCheckedChange={(checked) => {
                    handleCheckboxChange('insuranceOptions', insurance, checked)
                    handleCommaChange(insurance, checked)
                  }}
                />
                <Label htmlFor={`insurance-${insurance}`}>{insurance}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="zip-code">ZIP Code</Label>
                <Input
                  id="zip-code"
                  value={filters.location.zipCode}
                  onChange={(e) => handleFilterChange('location.zipCode', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={filters.location.address}
                  onChange={(e) => handleFilterChange('location.address', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-current-location"
                  checked={filters.location.useCurrentLocation}
                  onCheckedChange={(checked) => handleFilterChange('location.useCurrentLocation', checked)}
                />
                <Label htmlFor="use-current-location">Use My Current Location</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="radius">
          <AccordionTrigger>Radius</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={[filters.radius]}
                onValueChange={(value) => handleFilterChange('radius', value[0])}
                max={20}
                step={1}
              />
              <div className="flex justify-between">
                <span>1 Mile</span>
                <span>{filters.radius} Miles</span>
                <span>20 Miles</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 space-x-2">
        <Button onClick={resetFilters}>Reset Filters</Button>
      </div>
    </div>
  )
}

