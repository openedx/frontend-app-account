import { useQuery } from '@tanstack/react-query';
import { useSettingsFormDataState } from '.';
import { getTimeZones } from '../data/service';

interface SettingsFormDataState {
  formValues?: { country?: string },
}

const useTimezonesForCountry = () => {
  const { settingsFormDataState } = useSettingsFormDataState() as { settingsFormDataState: SettingsFormDataState };
  let timezones = [];
  const country = settingsFormDataState?.formValues?.country ?? false;
  const { data } = useQuery({
    queryKey: ['timezones', country],
    queryFn: () => getTimeZones(country),
    enabled: !!country,
  });
  timezones = data?.map(({ time_zone, description }) => ({
    value: time_zone, label: description,
  })) ?? [];

  return {
    timezones,
  };
};

export { useTimezonesForCountry };
