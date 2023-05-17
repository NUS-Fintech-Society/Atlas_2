import ApplicantCard from './ApplicantCard'

const ApplicantGrid = (data: any) => {
  return (
    <div className="my-20 mx-20 grid grid-cols-1 place-items-center gap-y-10 lg:my-10 lg:grid-cols-3 ">
      <ApplicantCard />
      <ApplicantCard />
      <ApplicantCard />
      <ApplicantCard />
      <ApplicantCard />
      <ApplicantCard />
    </div>
  )
}

export default ApplicantGrid
