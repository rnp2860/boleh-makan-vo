// app/api/prayer-times/route.ts
// 🕌 Prayer Times API Route

import { NextRequest, NextResponse } from 'next/server';

// JAKIM E-Solat API
const JAKIM_API_BASE = 'https://www.e-solat.gov.my/index.php';

// Aladhan API (backup)
const ALADHAN_API_BASE = 'https://api.aladhan.com/v1';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const zone = searchParams.get('zone') || 'WLY01';
    const provider = searchParams.get('provider') || 'jakim';
    const latitude = searchParams.get('lat');
    const longitude = searchParams.get('lng');
    const dateParam = searchParams.get('date');
    
    const date = dateParam ? new Date(dateParam) : new Date();

    let result;

    if (provider === 'jakim') {
      result = await fetchJAKIMPrayerTimes(zone, date);
    } else if (provider === 'aladhan' && latitude && longitude) {
      result = await fetchAladhanPrayerTimes(
        parseFloat(latitude),
        parseFloat(longitude),
        date
      );
    }

    // Fallback to Aladhan if JAKIM fails
    if (!result && latitude && longitude) {
      console.log('JAKIM failed, falling back to Aladhan API');
      result = await fetchAladhanPrayerTimes(
        parseFloat(latitude),
        parseFloat(longitude),
        date
      );
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to fetch prayer times' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Prayer times API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch prayer times' },
      { status: 500 }
    );
  }
}

async function fetchJAKIMPrayerTimes(zone: string, date: Date) {
  try {
    const url = `${JAKIM_API_BASE}?r=esolatApi/takwimsolat&period=date&zone=${zone}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('JAKIM API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.prayerTime || data.prayerTime.length === 0) {
      console.error('JAKIM API returned no data');
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${day}-${month}-${year}`;
    
    const dayData = data.prayerTime.find((d: any) => d.date === dateStr) || data.prayerTime[0];

    // Calculate Imsak (10 minutes before Subuh)
    const subuhTime = dayData.fajr;
    const imsakTime = calculateImsakFromSubuh(subuhTime, -10);

    return {
      date: `${year}-${month}-${day}`,
      hijri_date: dayData.hijri || '',
      location: zone,
      zone: zone,
      source: 'jakim',
      times: {
        imsak: imsakTime,
        subuh: dayData.fajr || '',
        syuruk: dayData.syuruk || '',
        zohor: dayData.dhuhr || '',
        asar: dayData.asr || '',
        maghrib: dayData.maghrib || '',
        isyak: dayData.isha || '',
      },
    };
  } catch (error) {
    console.error('Error fetching JAKIM prayer times:', error);
    return null;
  }
}

async function fetchAladhanPrayerTimes(latitude: number, longitude: number, date: Date) {
  try {
    const timestamp = Math.floor(date.getTime() / 1000);
    
    // Method 3 = Muslim World League
    const url = `${ALADHAN_API_BASE}/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=3`;

    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error('Aladhan API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.code !== 200 || !data.data) {
      console.error('Aladhan API returned invalid data');
      return null;
    }

    const timings = data.data.timings;
    const dateInfo = data.data.date;

    return {
      date: dateInfo.gregorian.date,
      hijri_date: `${dateInfo.hijri.day} ${dateInfo.hijri.month.en} ${dateInfo.hijri.year}`,
      location: `${latitude}, ${longitude}`,
      zone: 'ALADHAN',
      source: 'aladhan',
      times: {
        imsak: timings.Imsak || '',
        subuh: timings.Fajr || '',
        syuruk: timings.Sunrise || '',
        zohor: timings.Dhuhr || '',
        asar: timings.Asr || '',
        maghrib: timings.Maghrib || '',
        isyak: timings.Isha || '',
      },
    };
  } catch (error) {
    console.error('Error fetching Aladhan prayer times:', error);
    return null;
  }
}

function calculateImsakFromSubuh(subuhTime: string, offsetMinutes: number): string {
  if (!subuhTime) return '';
  
  const [hours, minutes] = subuhTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + offsetMinutes;
  
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

