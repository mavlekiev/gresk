import type { ZontApiResponse } from '../utils/interfaces/zont-devices.interface';

export async function getAuthToket(): Promise<string> {
  const url = 'https://my.zont.online/api/get_authtoken';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Basic z375552:jysu80su',
      client_name: 'My App',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка запроса: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.token;
}

// export async function getZontDevices(): Promise<ZontApiResponse> {
//   const url = 'http://localhost:5000/api/zont-devices';

//   const response = await fetch(url);

//   if (!response.ok) {
//     throw new Error('Ошибка получения данных');
//   }

//   const data: ZontApiResponse = await response.json();
//   return data;
// }

export async function getZontDevices(): Promise<ZontApiResponse> {
  const url = 'https://my.zont.online/api/widget/v3/devices';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-ZONT-Client': 'mavlekiev@gmail.com',
      'X-ZONT-TOKEN': '917anr4jyo1v8l59uweaaxs8agr7s4av',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка запроса: ${response.status} - ${errorText}`);
  }

  const data: ZontApiResponse = await response.json();
  return data;
}
