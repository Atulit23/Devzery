import React from 'react'

export default function LeftAll({ allUsers }) {
  function getBetterFormat(currentDate) {
    const date = new Date(currentDate);

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${(hours % 12 || 12)}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear() % 100;
    const formattedDate = `${day} ${month} ${year}`;

    const formattedDateTime = `${formattedDate}, ${formattedTime}`;

    return formattedDateTime
  }

  return (
    <div className='all__users'>
      <table>
        <thead className='table__head'>
          <th className='s_no'>S.No</th>
          <th className='equal'>Username</th>
          <th className='equal'>Email</th>
          <th className='equal'>Date of joining</th>
        </thead>
        {
          allUsers?.length > 0 && allUsers?.sort((a, b) => {
            return (new Date(b?.date_created)).getTime() - (new Date(a?.date_created)).getTime()
          })?.map((item, index) => {
            return (
              <tbody className='table__body'>
                <td className='s_no'>{index + 1}</td>
                <td className='equal'>{item?.username}</td>
                <td className='equal'>{item?.email}</td>
                <td className='equal'>{getBetterFormat(item?.date_created)}</td>
              </tbody>
            )
          })
        }
      </table>
    </div>
  )
}
